$(function(){
	addEvent();

	// イベント登録
	function addEvent(){
		$('.js-click-btn1').on('click', async ()=> {
			const lat = 37.949128891578425; // 新田真上の緯度
			const lon = 139.30167159084863; // 新田真上の経度

			const data = await fetchData(lat, lon);
			console.log('取得成功', data);

			displayResult(data);
		})

		$('.js-click-btn2').on('click', async ()=> {
			const lat = 35.64238097186191; // 恵比寿真上の緯度
			const lon = 139.7133929100686; // 恵比寿真上の経度

			const data = await fetchData(lat, lon);
			console.log('取得成功', data);

			displayResult(data);
			const $resultName = $('.js-result-name'); // 恵比寿のデータの地域名が三田だったので恵比寿に上書き
			$resultName.text(`今の恵比寿の天気`);	
		})
	}

	async function fetchData(lat, lon){
		const apiKey = 'aa7a73d4e1adaa457a3c2150d7604db3';
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja` ;

		try{
			const res = await fetch(url); // ① APIのURLを作成してアクセス → APIから返ってきた生のデータ（JSON形式の文字列）が res に入る
			if(!res.ok) throw new Error(`HTTP error status: ${res.status}`) // fetchでエラーになった場合にエラーを返す
			const data = await res.json(); // ② 文字列をオブジェクトに変換してdataに入れる（res.json() → JSON形式の文字列を解析してオブジェクトにする）
			return data;

		} catch (e){
			console.error(e);
		}
	}

	// データ表示
	function displayResult(data){
		// 名前
		const $resultName = $('.js-result-name');
		$resultName.text(`今の${data.name}の天気`);	

		// 気温
		const $resultTemp = $('.js-result-temp');
		$resultTemp.text(`${data.main.temp}℃`);

		// 天気アイコン
		const $resultIcon = $('.js-result-icon');
		const iconCode = data.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

		$resultIcon.attr('src', iconUrl);
	}

});


// GET で取得する場合、URLにパラメータをつけて取得する。パラメーターなので、全てリクエストが見える。秘密情報は送れない
// (OpenWeather側はGETしか受け付けない)
// POST でリクエストを送る場合は、パラメータとして送るわけではないのでリクエストが見えない。秘密の情報を送る時はこちらからリクエストする
// GETもPOSTもどちらもリクエストを送ってリクエストに応じた返答を取得できるけど、リクエストの送り方が違う