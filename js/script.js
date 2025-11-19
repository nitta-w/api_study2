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
			if(!selectDay || !selectPlace || selectitem.length === 0){
				alert('選択していないものがあるよ！');
				return;
			}

			console.log(selectDay, selectPlace, selectitem);

			// .loader の表示
			$('.loader').addClass('active');

			const data = await fetchData(selectDay, selectPlace);

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
			displayResult(jstData, selectitem);
		})
	}

	// GASからfetch
	async function fetchData(selectDay, selectPlace){
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


	function displayResult(data, selectitem){
		// ライブラリ Chart.jsを使用
		const chartMaster = {
			temp : {
				label: '気温', 
				data: data.map(d => d.気温), 
				borderColor: '#f88',
				yAxisID: 'y0'
			},
			humi : {
				label: '湿度', 
				data: data.map(d => d.湿度), 
				borderColor: '#484',
				yAxisID: 'y1'
			},
			press : {
				label: '気圧', 
				data: data.map(d => d.気圧), 
				borderColor: '#7baade',
				yAxisID: 'y2'
			}
		}
		const yMaster = {
			temp : { min: 0, max: 40, step: 10 },
			humi : { min: 0, max: 100, step: 10 },
			press : { min: 800, max: 1100, step: 100 }
		};
        let lineCtx = document.getElementById("chart");

		// y軸の scales を生成
		let yAxisScales = {};
		selectitem.forEach((key, index) => {
			yAxisScales[chartMaster[key].yAxisID] = {
				type: 'linear',
				position: index === 0 ? 'left' : 'right',
				suggestedMin : yMaster[key].min,
				suggestedMax : yMaster[key].max,
				ticks : {
					stepSize : yMaster[key].step,
				}
			}
		})

        // 線グラフの設定
        let lineConfig = {
          type: 'line',
          data: {
			labels: [...Array(24).keys()], // labels: ['0', '1', '2', 〜 '23'],
            datasets: selectitem.map(key => chartMaster[key])
          },
          options: {
            scales: yAxisScales
          }
        };
        
		lineChart = new Chart(lineCtx, lineConfig);

		// .loader の非表示
		$('.loader').removeClass('active');

	}

});



		// // 天気アイコン
		// const $resultIcon = $('.js-result-icon');
		// const iconCode = data.weather[0].icon;
		// const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

		// $resultIcon.attr('src', iconUrl);
