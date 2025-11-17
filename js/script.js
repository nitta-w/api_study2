$(function(){
	setDay();
	// addEvent();
	displayResult();

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

	// 
	function setDay(){
		

	}

	// データ表示
	function displayResult(){

        let lineCtx = document.getElementById("chart");
        // 線グラフの設定
        let lineConfig = {
          type: 'line',
          data: {
            // ※labelとデータの関係は得にありません
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            datasets: [{
              label: 'Red',
              data: [20, 35, 40, 30, 45, 35, 40, 40, 30, 45, 35, 40, 40],
              borderColor: '#f88',
            }, {
              label: 'Green',
              data: [20, 15, 30, 25, 30, 40, 35, 40, 30, 45, 35, 40, 45],
              borderColor: '#484',
            }, {
              label: 'Blue',
              data: [1000, 2000, 1400, 2400, 2500, 2200, 2020, 1098, 2761, 1000, 2030, 2000, 2080],
              borderColor: '#48f',
            }],
          },
          options: {
            scales: {
              // Y軸の最大値・最小値、目盛りの範囲などを設定する
              y: {
                suggestedMin: 0,
                suggestedMax: 60,
                ticks: {
                  stepSize: 20,
                }
              }
            },
          },
        };
        let lineChart = new Chart(lineCtx, lineConfig);


		// // 名前
		// const $resultName = $('.js-result-name');
		// $resultName.text(`今の${data.name}の天気`);	

		// // 気温
		// const $resultTemp = $('.js-result-temp');
		// $resultTemp.text(`${data.main.temp}℃`);

		// // 天気アイコン
		// const $resultIcon = $('.js-result-icon');
		// const iconCode = data.weather[0].icon;
		// const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

		// $resultIcon.attr('src', iconUrl);
	}

});
