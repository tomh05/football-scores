<?php
const DEFAULT_CACHE_TIME = 180;

$cacheTime = ($_REQUEST["cacheTime"]==null)?DEFAULT_CACHE_TIME:intval($_REQUEST["cacheTime"]);
if (!is_int($cacheTime) ||  $cacheTime<=0) {
	$cacheTime = DEFAULT_CACHE_TIME;
}

$localFilePath = buildLocalPath();
// get file cached of disk (reduce hits to opta API)
$useCache = ($_REQUEST["proxyMethod"]=="cache");

header('x-using-local-file-cache: '.($useCache?"true":"false"));
header('x-local-cache-time: '.$cacheTime."s");
if ($useCache && !file_exists($localFilePath)) {
	throw new Exception("File is not present in cache");
}
if ($useCache || (file_exists($localFilePath) && (time()-filemtime($localFilePath) < $cacheTime))) {
	$xmlContent = file_get_contents($localFilePath);
	header('x-local-file: '.$localFilePath);
	$timeleft = $cacheTime - (time()-filemtime($localFilePath));
	header('Expires: '.gmdate('D, d M Y H:i:s \G\M\T', time()+$timeleft));
} else {
	// download from OPTA and store locally on file system for next hit.
	$remoteurl = buildRemoteUrl();
	$useReithProxy = ($_REQUEST["proxyMethod"]==null || $_REQUEST["proxyMethod"]=="reith");
	$xmlContent = downloadRemoteUrl($remoteurl,$useCache,$useReithProxy);
	header('x-remote-file: '.$remoteurl);
	header('Expires: '.gmdate('D, d M Y H:i:s \G\M\T', time()+$cacheTime));
	if ($xmlContent != null && strlen($xmlContent)>0) {
		writeLocalCachedFile($localFilePath,$xmlContent);
	}
}
header('content-type: text/xml');
echo $xmlContent;

function buildLocalPath() {
	$localFilePath = "data/";
	if ($_REQUEST["competition"] != null) {
		$localFilePath .= "competition/".$_REQUEST["competition"]."/";
	}
	if ($_REQUEST["season_id"] != null) {
		$localFilePath .= $_REQUEST["season_id"]."/";
	}
	if ($_REQUEST["game_id"] != null) {
		$localFilePath .= "game_id/".$_REQUEST["game_id"]."/";
	}
	if ($_REQUEST["feed_type"] != null) {
		$localFilePath .= $_REQUEST["feed_type"].".xml";
	}
	return $localFilePath;
}

function buildRemoteUrl() {
	$remoteurl = 'http://omo.cloud.opta.net/';
	if ($_REQUEST["competition"] != null) {
		$remoteurl.="competition";
	}
	$remoteurl.="?";
	$permittedParams = array('game_id','language','feed_type','season_id','competition');
	foreach ($permittedParams as $param) {
		if ($_REQUEST[$param] !== null) {
			$remoteurl .= "&".$param."=".urlencode($_REQUEST[$param]);
		}
	}
	return $remoteurl;
}

function downloadRemoteUrl($remoteurl,$useCache,$useReithProxy) {
	$aContext = array();
	if ($useReithProxy) {
		$aContext['http']=
			array(
				'proxy' => 'www-cache.reith.bbc.co.uk:80',
				'request_fulluri' => true,
			);
	}
	$cxContext = stream_context_create($aContext);	
	$content = file_get_contents($remoteurl, False, $cxContext);
	return $content;
}

function writeLocalCachedFile($localFilePath,$content) {
	$dir = dirname($localFilePath);
	if (!file_exists($dir)) {
		mkdir($dir, 0777, true);
	}
	file_put_contents ($localFilePath,$content);
	if (!file_exists($localFilePath) ) {
		throw "Error writing file $localFilePath";
	}
}
?>