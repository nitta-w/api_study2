$(function(){
	addEvent();

	// イベント登録
	function addEvent(){
		$('[name="select_item"]').on('change', function(e) {
			const checked = $('[name="select_item"]:checked');

			if(checked.length > 2){
				alert('選べるのは2つまでだよ！');
				$(this).prop('checked', false);
				return;
			}
		})

		$('.js-click-btn').on('click', async () => {

			const selectDay = $('[name="select_day"]').val();
			const selectPlace = $('[name="select_place"]:checked').val();
			const selectitem = $('[name="select_item"]:checked').map(function(){
				return $(this).val();
			}).get();

			console.log(selectDay, selectPlace, selectitem);

			const data = await fetchData(selectDay, selectPlace, selectitem);

			console.log(data);

			// const lat = 37.949128891578425; // 新田真上の緯度
			// const lon = 139.30167159084863; // 新田真上の経度

			// const data = await fetchData(lat, lon);
			// console.log('取得成功', data);

			// displayResult(data);
		})
	}

	async function fetchData(selectDay, selectPlace, selectitem){
		const url = `https://script.google.com/macros/s/AKfycbxqfCYFXShNrIeVfJSNEru0qcCfivL84zfwdZioYWmeNnK-APoMd-_7B0Cg3lEc5G-iVw/exec?sheet=${selectPlace}` ;

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
