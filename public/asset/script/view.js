const pageQuery = [...new URLSearchParams(location.search).entries()].reduce((obj, e) => ({ ...obj, [e[0]]: e[1] }), {});
const locationName = pageQuery?.name;
const isIOS = /iPhone|CriOS/.test(navigator.userAgent);
if (isIOS) {
	document.getElementById("pannellumFullScreen").style.display = "none";
}
const notFoundMessage = "<h1>404 Not Found</h1><p style='margin-top:1rem;'>お探しの施設は見つかりませんでした。お手数ですが<a href='./'>施設一覧</a>ページから探し直していただくようお願いします。</p>";
const db = firebase.firestore();
if (!locationName) {
	document.getElementById("imageAreaWrapper").style.display = "none";
	document.getElementById("textArea").innerHTML = notFoundMessage;
} else {
	const docRef = db.collection("locations").doc(locationName);
	docRef.get({ source: "server" }).then((doc) => viewDisplay(doc)).catch((error) => {
		document.getElementById("imageAreaWrapper").style.display = "none";
		document.getElementById("textArea").innerHTML = notFoundMessage + error;
	});
}

function viewDisplay(doc) {
	if (doc.exists) {
		var getData = doc.data();
		getData.pannellum.showControls = false;
		viewer = pannellum.viewer('panorama', getData.pannellum);
		document.getElementById('pannellumZoomIn').addEventListener('click', function (e) {
			gtag('event', 'zoom_in', {
				'event_category': 'engagement'
			});
			viewer.setHfov(viewer.getHfov() - 10);
		});
		document.getElementById('pannellumZoomOut').addEventListener('click', function (e) {
			gtag('event', 'zoom_out', {
				'event_category': 'engagement'
			});
			viewer.setHfov(viewer.getHfov() + 10);
		});
		document.getElementById('pannellumFullScreen').addEventListener('click', function (e) {
			gtag('event', 'fullscreen', {
				'event_category': 'engagement'
			});
			viewer.toggleFullscreen();
		});
		if (viewer.isOrientationSupported()) {
			const orient = document.getElementById("pannellumOrientation");
			orient.style.display = "inline-flex";
			orient.addEventListener('click', function (e) {
				gtag('event', 'orientation', {
					'event_category': 'engagement'
				});
				viewer.isOrientationActive() ? viewer.stopOrientation() : viewer.startOrientation();
				viewer.isOrientationActive() ? orient.classList.add("on") : orient.classList.remove("on");
			});
		}
		document.getElementById("name").innerHTML = getData.name;
		document.getElementById("building").innerHTML = getData.building;
		document.getElementById("stair").innerHTML = getData.stair;
		document.getElementById("description").innerHTML = getData.description;
		document.title = getData.name + " | Look Inside View - shfes'21";
		if (getData.near.length !== 0) {
			let outputNear = "<div class='eachBlock'>";
			for (let i = 0; i < getData.near.length; i++) {
				if (!getData.near[i]?.icon) {
					icon = "fas fa-school";
				} else {
					icon = getData.near[i].icon;
				}
				outputNear += "<a class='eachLocationLink' href='./view.html?name=" + getData.near[i].name + "'><div class='eachLocation'><div class='eachLocationIcon'><i class='" + icon + " fa-fw'></i></div><div class='eachLocationName'>" + getData.near[i]?.jpName + "</div></div></a>";
			}
			document.getElementById("near").innerHTML = outputNear + "</div>";
		} else {
			document.getElementById("nearBlock").style.display = "none";
		}
		flag = false;
		if (getData?.prev?.name) {
			document.getElementById("prevBtn").innerHTML = `<a class='eachLocationLink' href='./view.html?name=${getData.prev?.name}'><div class='eachLocation left'><div class='eachLocationIcon'><i class='fas fa-chevron-left fa-fw'></i></div><div class='eachLocationName'>${getData.prev?.jpName}</div></div></a>`;
			flag = true;
		}
		if (getData?.next?.name) {
			document.getElementById("nextBtn").innerHTML = `<a class='eachLocationLink' href='./view.html?name=${getData.next?.name}'><div class='eachLocation right'><div class='eachLocationName'>${getData.next?.jpName}</div><div class='eachLocationIcon'><i class='fas fa-chevron-right fa-fw'></i></div></div></a>`;
			flag = true;
		}
		if (!flag) {
			document.getElementById("bottomBtnArea").style.display = "none";
		}
		const scenes = getData.pannellum.scenes;
		sceneList = []
		for (scene in scenes) {
			if (scenes.hasOwnProperty(scene) && scenes[scene]?.isSameLocation) {
				sceneList.push(scene)
			}
		}
		if (sceneList.length != 0) {
			var code = "<div id='sceneList'><button class='eachScene' onclick='sceneChange(\"default\")'>初期位置</button>";
			for (var eachScene of sceneList) {
				code += "<button class='eachScene' onclick='sceneChange(\"" + eachScene + "\")'>" + eachScene + "</button>";
			}
			document.getElementById("sceneChange").innerHTML = code + "</div>";
		}
		viewer.on('mousedown', function (event) {
			var coords = viewer.mouseEventToCoords(event);
			var params = {
				"pitch": coords[0],
				"yaw": coords[1],
				"Hfov": viewer.getHfov()
			}
			console.log(params);
		})
	}
	else {
		document.getElementById("imageAreaWrapper").style.display = "none";
		document.getElementById("textArea").innerHTML = notFoundMessage;
	}
}

function sceneChange(sceneId) {
	console.log(sceneId)
	viewer.loadScene(sceneId)
}