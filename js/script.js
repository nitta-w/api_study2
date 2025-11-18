$(function(){
	let lineChart = null;

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
				return;
			}

			// .loader の表示
			displayLoader();

			console.log(selectDay, selectPlace, selectitem);

			const data = await fetchData(selectDay, selectPlace, selectitem);

			// UTC → JST に変換（データ取得には関わらない 表示のみ調整）
			const jstData = data.map(d => {
				const date = new Date(d.取得日時);
				return {
					...d,
					取得日時: date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) // JST 表示用
				};
			});

			console.log(jstData);

			// .js-result-text を地点名に変更
			const placeName ={
				data1 : '新田上空(新潟)',
				data2 : '恵比寿',
				data3 : 'サポート本社(大阪)'
			}
			$('.js-result-text').text(placeName[selectPlace] + 'の天気');

			// グラフの表示
			if(lineChart){ // すでに一度表示済みの場合はクリア
				lineChart.destroy();
			}
			displayResult(jstData);
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

	function displayResult(data){
		// ライブラリ Chart.jsを使用
        let lineCtx = document.getElementById("chart");

        // 線グラフの設定
        let lineConfig = {
          type: 'line',
          data: {
			labels: [...Array(24).keys()], // labels: ['0', '1', '2', 〜 '23'],
            datasets: [{
              label: '気温',
              data: data.map(d => d.気温), // data: [data[0].気温, data[1].気温, data[2].気温, 〜 data[23].気温,],
              borderColor: '#f88',
            }, {
              label: '湿度',
              data: data.map(d => d.湿度), // data: [data[0].湿度, data[1].湿度, data[2].湿度, 〜 data[23].湿度,],
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
        
		lineChart = new Chart(lineCtx, lineConfig);

		// .loader の非表示
		displayLoader();


		// // 天気アイコン
		// const $resultIcon = $('.js-result-icon');
		// const iconCode = data.weather[0].icon;
		// const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

		// $resultIcon.attr('src', iconUrl);
	}

	// .loader の表示切り替え
	function displayLoader(){
		$('.loader').toggleClass('active');
	}

});
