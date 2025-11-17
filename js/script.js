$(function(){
	setDay();
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

			// バリデーション
			// if(!selectDay || !selectPlace || selectitem.length === 0){
			// 	alert('選択していないものがあるよ！');
			// }
			if(!selectDay || !selectPlace){
				alert('選択していないものがあるよ！');
			}

			console.log(selectDay, selectPlace, selectitem);

			const data = await fetchData(selectDay, selectPlace, selectitem);

			console.log(data);

			displayResult(data);
		})
	}

	// GASからfetch
	async function fetchData(selectDay, selectPlace, selectitem){
		const url = `https://script.google.com/macros/s/AKfycbyO4MNxRtbmTh0OZN7xaGTgrj4OQmdCHszR5SwMjPPCrzic1PeGmyB1JFviFo1WPqOQFg/exec?sheet=${selectPlace}&day=${selectDay}` ; // GAS側のデプロイでver変わったらURLの変更必須

		try{
			const res = await fetch(url); // ① APIのURLを作成してアクセス → APIから返ってきた生のデータ（JSON形式の文字列）が res に入る
			if(!res.ok) throw new Error(`HTTP error status: ${res.status}`) // fetchでエラーになった場合にエラーを返す
			const data = await res.json(); // ② 文字列をオブジェクトに変換してdataに入れる（res.json() → JSON形式の文字列を解析してオブジェクトにする）
			return data;

		} catch (e){
			console.error(e);
		}
	}

	// 選択可能なカレンダーの範囲をセット
	function setDay(){
		const today = new Date().toISOString().split('T')[0];
		const minDate = '2025-11-14';

		$('#js-select-day').attr('min', minDate);
		$('#js-select-day').attr('max', today);
	}

	// データ表示
	function displayResult(data){

        let lineCtx = document.getElementById("chart");
        // 線グラフの設定
        let lineConfig = {
          type: 'line',
          data: {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            datasets: [{
              label: 'Red',
              data: [data[0].気温, data[1].気温, data[2].気温, data[3].気温, data[4].気温, data[5].気温, data[6].気温, data[7].気温, data[8].気温, data[9].気温, data[10].気温, data[11].気温, data[12].気温, data[13].気温, data[14].気温, data[15].気温, data[16].気温, data[17].気温, data[18].気温, data[19].気温, data[20].気温, data[21].気温, data[22].気温, data[23].気温,],
              borderColor: '#f88',
            }, {
              label: 'Green',
              data: [data[0].湿度, data[1].湿度, data[2].湿度, data[3].湿度, data[4].湿度, data[5].湿度, data[6].湿度, data[7].湿度, data[8].湿度, data[9].湿度, data[10].湿度, data[11].湿度, data[12].湿度, data[13].湿度, data[14].湿度, data[15].湿度, data[16].湿度, data[17].湿度, data[18].湿度, data[19].湿度, data[20].湿度, data[21].湿度, data[22].湿度, data[23].湿度,],
              borderColor: '#484',
            }],
          },
          options: {
            scales: {
              // Y軸の最大値・最小値、目盛りの範囲などを設定する
              y: {
                suggestedMin: 0,
                suggestedMax: 100,
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
