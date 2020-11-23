//imports essentials
const socket = io('http://localhost:5000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

//imports buttons
const readybutton = document.getElementById('ready');
const redbutton = document.getElementById('red');
const greenbutton = document.getElementById('green');
const purplebutton = document.getElementById('purple');
const bluebutton = document.getElementById('blue');
const startbutton = document.getElementById('start');
const addCars = document.getElementById('add-cars');
const close = document.getElementById('close');
const roll = document.getElementById('roll');


//import player colors
const p1 = document.getElementById('r')
const p2 = document.getElementById('b')
const p3 = document.getElementById('g')
const p4 = document.getElementById('p')

//imports numbers for spinny wheel
const spinNum = document.getElementById('spin-num');

//imports others
const card = document.getElementById('card');
const lobby = document.getElementById('lobby');
const gameInfo = document.getElementById('gamestuff');


const first = document.getElementById('first-player');
const second = document.getElementById('second-player');
const third = document.getElementById('third-player');
const fourth = document.getElementById('fourth-player');

const firstMoney = document.getElementById('first-money');
const secondMoney = document.getElementById('second-money');
const thirdMoney = document.getElementById('third-money');
const fourthMoney = document.getElementById('fourth-money');




var squares = [1, 4, 8, 10, 11, 13, 16, 19, 20, 24, 28, 30, 31, 33, 35, 36, 39, 41, 42, 45, 46, 
48, 52, 54, 55, 57, 59, 63, 65, 66, 69, 72, 74, 75, 77, 80, 83, 84, 87, 89, 91, 92, 93, 98, 99, 101];
var words = ['You try making the whipped coffee that has been trending on Tiktok +$10', 
'You begin sewing and selling masks online +$500',
'You throw a party at your house and are fined by the city -$200', 
'You take a walk around the block. First time out of the house in a month! +$50', 
'You are lonely :(   +$0', 
'You spend 3 hours learning a Tiktok dance only to get 11 views -$100',
'You bake some cookies! Good for you +$80',
'You cut your own bangs. They are not cute :/ -$150',
'Your dog is happy that you are home all day +$200',
'You have worn the same sweatpants 5 days in a row -$100',
'Your family is driving you nuts -$100',
'You spend all day watching Netflix as usual +$5',
'No more ice cream in the freezer :( -$5',
'You learn to skateboard +$120',
'You zoom your friends +$200',
'Your favorite aunt sends you some money because she knows you are broke +$500',
'You start feeding the squirrels in your backyard because you are lonely +$30',
'Your friends want to hang out with you but your mom says no -$200',
'You fall for Timothy Chalamet +100',
'Your brother posts shirtless Tiktoks of himself. Ew -$100',
'You exercise for the first time in years +$200',
'Addison Rae likes your comment +10',
'Someone tells you that you look like Madison Beer. Your ego is through the roof +400',
'You have become Tiktok famous & landed a brand deal! +$500',
'You say hi to the mailman. First social interaction in a week! +$100',
'You dye your hair pink out of boredom +$50',
'You order some Taco Bell for the 4th time this week -$10',
'Awkward zoom meeting -$50',
'Your favorite gelato shop closes because not enough business :( -$200',
'Your acne finally clears up. Woohoo! +$150',
'Your best friend brings over some pizza +$50',
'You make a charcuterie board because you want to be a trendy teen +$100',
'Cute Starbucks worker hits on you ;) +$150',
'You spend way too much money online shopping -$300',
'You spend Halloween eating candy alone at home -$40',
'You play Among Us with your friends. You are the imposter +$80',
'You knit a sweater for your dog, he loves it :) +$120',
'Your mom makes you some dino nuggets. Thanks mom :) +$50',
'You tell yourself that you\'re going to get in shape during quarantine but that\'s a lie -$60',
'Quarantine glow up +$150',
'You spend 10 hrs a day on Tiktok -$30',
'You volunteer to be part of covid vaccine trials +$200',
'You adopt a little orange kitten +$100',
'You wake up before noon for the first time this month, good job +$150',
'You run out of toilet paper and the store is out of stock -$50',
'Charli D\'amelio duets your Tiktok and you gain 100,000 followers +$200'];
var moneyValues = [10, 500, -200, 50, 0, -100, 80, -150, 200, -100, -100, 5, -5, 120, 200, 500, 
30, -200, 100, -100, 200, 10, 400, 500, 100, 50, -10, -50, -200, 150, 50, 100, 150, -300, -40,
80, 120, 50, -60, 150, -30, 200, 100, 150, -50, 200]

//----------------------------------------------------------------------
if (messageForm != null) {
	//little pop up that asks you for your name
  const name = prompt('Pick a username')
  //tells you the room name and that you joined
  appendMessage(`Room: ${roomName}`)
  appendMessage('you joined')
  //tells the others about your name
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    //set message variable equal to what's in the input box
    const message = messageInput.value
    //make your message appear on your screen
    appendMessage(`You: ${message}`)
    //send the message to all others in the room
    socket.emit('send-chat-message', roomName, message)
    //clear the message box so they can write something again
    messageInput.value = ''
  });

  //when one person presses ready, all of the color buttons are activated
  const addReadyListener = () => {
  	readybutton.addEventListener('click', () => {
  		const signal = readybutton;
  		socket.emit('ready-pressed', roomName, signal);
  		appendMessage('All players have joined lobby')
		readybutton.disabled=true;
		redbutton.disabled=false;
		greenbutton.disabled=false;
		purplebutton.disabled=false;
		bluebutton.disabled=false;
  	})
  }
  addReadyListener();

  //when player picks a car color, the color buttons become deactivated for
  //that player
  const addButtonListeners = () => {
	['red', 'green', 'purple', 'blue'].forEach((id) => {
		const button = document.getElementById(id);
		button.addEventListener('click', () => {
			socket.emit('choice-of-car', roomName, id);
			appendMessage(`you chose the ${id} car`)
			redbutton.disabled=true;
			greenbutton.disabled=true;
			purplebutton.disabled=true;
			bluebutton.disabled=true;
		});
	});
  };
  addButtonListeners();

  //when one player presses the start button, gameboard appears
  const addStartListener = () => {
  	startbutton.addEventListener('click', () => {
  		const start = startbutton;
  		socket.emit('start-pressed', roomName, start);
  	})
  }
  addStartListener();

  //when the car button is pressed, the cars get added to the board
  const addCarListener = () => {
  	addCars.addEventListener('click', () => {
		this.message = 'add the cars';
		socket.emit('yes-cars', roomName, this.message);
	})
  }
  addCarListener();

}





//----------------------------------------------------------------------
//creates room
socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

//message appears when someone joins the room
socket.on('user-connected', name => {
  appendMessage(`${name} is playing`)
})

//message appears when somone leaves the room
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

//message appears for everyone when someone sends something
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

//all of the color buttons are activated when all players are in lobby
socket.on('everyone-ready', id => {
	readybutton.disabled=true;
		redbutton.disabled=false;
		greenbutton.disabled=false;
		purplebutton.disabled=false;
		bluebutton.disabled=false;
		appendMessage(`All players have joined lobby`)

})

//message appears when someone chooses a car color
socket.on('car-chosen', id => {
	const button = document.getElementById(id);
	button.setAttribute('disabled', 'disabled');
	appendMessage(`${id} car has been chosen by another player`)

})

//start button is activated when everyone has chosen a car color
socket.on('activate-start', id => {
	startbutton.style.display = 'flex';
})

//function that messages appear
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

//displays roll button for the first player at the beginning
socket.on('enable-button-0', message => {
	roll.style.display = 'flex';
})

//displays roll button for players when it's their turn
socket.on('enable-button', num => {
	roll.style.display = 'flex';
})





//----------------------------------------------------------------------
class WaitingScene extends
    Phaser.Scene{
      constructor() {
        super({ key:'WaitingScene'})
      }

      preload() {}

      create() {
      	this.game.canvas.id = 'gamecanvas';

      	//switches from waiting room scene to game board scene
      	socket.on('game-begins', start => {
			lobby.style.display = 'none';
			gameInfo.style.display = 'flex';
			this.scene.stop('WaitingScene');
			this.scene.start('StartScene');
		})
      }

      update() {}
    }





//----------------------------------------------------------------------
class StartScene extends
    Phaser.Scene{
      constructor() {
        super({ key:'StartScene' })
      }

      preload() {
        const loadTiles = [['orange', './images/orangetile.png'], ['yellow', './images/yellowtile.png'],
        ['green', './images/greentile.png'], ['red', './images/redtile.png']]

        for (var i=0; i<loadTiles.length; i++) {
            this.load.image(loadTiles[i][0], loadTiles[i][1], loadTiles[i][2])
        }


        const loadBuildings = [['bluehouse', './images/bluehouse.png'], ['brownhouse', './images/brownhouse.png'], 
        ['orangehouse', './images/orangehouse.png'], ['whitehouse', './images/whitehouse.png'], ['pinkhouse', './images/pinkhouse.png'],
        ['restaurant', './images/restaurant.png'], ['sheriff', './images/building1.png']]

        for (var i=0; i<loadBuildings.length; i++) {
            this.load.image(loadBuildings[i][0], loadBuildings[i][1], loadBuildings[i][2])
        }


        const loadNature = [['mount1', './images/mountains1.png'], ['mounty', './images/mounty.png'],
        ['tree', './images/treepic.png'], ['tree2', './images/tree2.png'], ['tree3', './images/tree3.png'],
        ['tree-2spears', './images/tree4.png'], ['tree5', './images/tree5.png'], ['tree6', './images/tree6.png'],
        ['tree7', './images/tree7.png'], ['tree8', './images/tree8.png'], ['tree9', './images/tree9.png'],
        ['tree-2oval', './images/tree10.png'], ['tree-spear', './images/tree11.png'], ['tree-pine', './images/tree12.png'],
        ['tree-pear', './images/tree13.png'], ['flower1', './images/flowers1.png'], ['flower2', './images/flowers2.png'],
        ['flower3', './images/flowers3.png'], ['flower4', './images/flowers4.png']]

        for (var i=0; i<loadNature.length; i++) {
            this.load.image(loadNature[i][0], loadNature[i][1], loadNature[i][2])
        }


        const loadCars = [['bluecar', './images/bluecar.png'], ['greencar', './images/greencar.png'],
        ['redcar', './images/redcar.png'], ['purplecar', './images/purplecar.png']]

        for (var i=0; i<loadCars.length; i++) {
            this.load.image(loadCars[i][0], loadCars[i][1], loadCars[i][2])
        }
      }

      create() {
		this.game.canvas.id = 'gamecanvas2';
		roll.style.display = 'none';

		//adds tiles
		this.tiles = [ [300, 175, 'orange'], [300, 270, 'orange'], [300, 365, 'yellow'],
		[395, 365, 'yellow'], [490, 365, 'orange'], [585, 365, 'red'], [585, 460, 'yellow'],
		[585, 555, 'green'], [585, 650, 'orange'], [680, 650, 'yellow'], [775, 650, 'orange'],
		[775, 555, 'orange'], [775, 460, 'yellow'], [775, 365, 'orange'], [775, 270, 'yellow'],
		[775, 175, 'yellow'], [870, 175, 'orange'], [965, 175, 'yellow'], [1060, 175, 'green'],
		[1155, 175, 'orange'], [1250, 175, 'orange'], [1250, 270, 'yellow'], [1250, 365, 'yellow'],
		[1155, 365, 'yellow'], [1060, 365, 'orange'], [965, 365, 'yellow'], [965, 460, 'yellow'],
		[965, 555, 'yellow'], [1060, 555, 'orange'], [1155, 555, 'yellow'], [1250, 555, 'orange'],
		[1250, 650, 'orange'], [1250, 745, 'red'], [1155, 745, 'orange'], [1060, 745, 'yellow'],
		[965, 745, 'orange'], [965, 840, 'orange'], [870, 840, 'green'], [775, 840, 'yellow'],
		[680, 840, 'orange'], [585, 840, 'yellow'], [490, 840, 'orange'], [395, 840, 'orange'],
		[300, 840, 'yellow'], [300, 935, 'yellow'], [300, 1030, 'orange'], [300, 1125, 'orange'],
		[300, 1220, 'yellow'], [395, 1220, 'orange'], [490, 1220, 'yellow'], [490, 1125, 'yellow'],
		[490, 1030, 'yellow'], [585, 1030, 'orange'], [680, 1030, 'yellow'], [680, 1125, 'orange'],
		[680, 1220, 'orange'], [680, 1315, 'yellow'], [680, 1410, 'orange'], [585, 1410, 'yellow'],
		[490, 1410, 'orange'], [395, 1410, 'green'], [300, 1410, 'yellow'], [300, 1505, 'yellow'],
		[300, 1600, 'orange'], [395, 1600, 'yellow'], [490, 1600, 'orange'], [585, 1600, 'orange'],
		[680, 1600, 'yellow'], [775, 1600, 'red'], [870, 1600, 'orange'],
		[870, 1505, 'yellow'], [870, 1410, 'yellow'], [870, 1315, 'orange'], [870, 1220, 'yellow'],
		[870, 1125, 'orange'], [870, 1030, 'orange'], [965, 1030, 'yellow'], [1060, 1030, 'orange'],
		[1155, 1030, 'green'], [1250, 1030, 'yellow'], [1250, 1125, 'orange'], [1250, 1220, 'yellow'],
		[1155, 1220, 'yellow'], [1060, 1220, 'orange'], [1060, 1315, 'orange'], [1060, 1410, 'yellow'],
		[1155, 1410, 'yellow'], [1250, 1410, 'orange'], [1250, 1505, 'yellow'], [1250, 1600, 'orange'],
		[1155, 1600, 'yellow'], [1060, 1600, 'orange'], [1060, 1695, 'orange'], [1060, 1790, 'orange'],
		[965, 1790, 'yellow'], [870, 1790, 'green'], [775, 1790, 'yellow'], [680, 1790, 'yellow'],
		[585, 1790, 'orange'], [490, 1790, 'orange'], [395, 1790, 'yellow'], [300, 1790, 'orange']]

		for (var i=0; i<this.tiles.length; i++) {
			this.add.image(this.tiles[i][0], this.tiles[i][1], this.tiles[i][2])
		}


		//adds mountains
		const mountains = [[600, 50, 'mounty'], [1030, 50, 'mounty'], [370, 58, 'mount1'],
		[815, 58, 'mount1'], [1170, 58, 'mount1']]

		for (var i=0; i<mountains.length; i++) {
			this.add.image(mountains[i][0], mountains[i][1], mountains[i][2])
		}

		//adds decor (region 1)
		const region1 = [[382, 275, 'tree'], [465, 275, 'brownhouse'], [250, 200, 'tree-pine'],
		[300, 700, 'whitehouse'], [250, 730, 'tree-pine'], [315, 430, 'tree-pine'], [357, 464, 'flower3'],
		[490, 460, 'bluehouse'], [453, 538, 'flower2'], [390, 615, 'flower1'], [239, 300, 'tree2'],
		[267, 530, 'tree-2spears'], [480, 700, 'tree-2oval']]

		for (var i=0; i<region1.length; i++) {
			this.add.image(region1[i][0], region1[i][1], region1[i][2])
		}

	    //adds decor (region 2)
		const region2 =[[695, 200, 'orangehouse'], [695, 330, 'tree-2oval'], [663, 266, 'tree-spear'],
		[700, 440, 'tree-2spears'], [672, 530, 'tree9'], [870, 400, 'pinkhouse'], [992, 270, 'restaurant'],
		[1070, 490, 'sheriff'], [880, 500, 'tree7'], [880, 300, 'tree9'], [1080, 600, 'tree5'],
		[1080, 300, 'tree'], [1015, 500, 'tree-spear'], [585, 670, 'flower3']]
		for (var i=0; i<region2.length; i++) {
			this.add.image(region2[i][0], region2[i][1], region2[i][2])
		}

		// adds decor (region 3)
		const region3 = [[720, 740, 'orangehouse'], [900, 620, 'brownhouse'], [1020, 670, 'flower2'],
		[1070, 850, 'bluehouse'], [1228, 920, 'whitehouse'], [780, 1050, 'pinkhouse'], [400, 950, 'bluehouse'],
		[500, 1500, 'restaurant'], [580, 1310, 'brownhouse'], [800, 1380, 'orangehouse'], [770, 1180, 'tree-2oval'],
		[380, 1320, 'flower2'], [580, 1200, 'tree7'], [400, 1140, 'flower3'], [630, 930, 'tree-2spears'],
		[1117, 880, 'tree-spear'], [863, 960, 'flower1'], [570, 1500, 'tree-spear'], [905, 934, 'tree9'],
		[755, 1450, 'flower3'], [664, 935, 'tree-pine'], [800, 1240, 'tree-2spears'], [660, 1495, 'tree-pine']]
		for (var i=0; i<region3.length; i++) {
			this.add.image(region3[i][0], region3[i][1], region3[i][2])
		}

		// adds decor (region 4)
		const region4 = [[320, 1690, 'whitehouse'], [390, 1690, 'tree-2spears'], [650, 1690, 'bluehouse'],
		[990, 1490, 'pinkhouse'], [970, 1180, 'whitehouse'], [1200, 1700, 'brownhouse'], [1090, 1490, 'flower1'],
		[850, 1690, 'flower2'], [1270, 1780, 'flower3'], [1150, 1300, 'tree-spear'], [1190, 1320, 'tree-2spears'],
		[1050, 1160, 'tree-pine'], [970, 1350, 'tree7'], [930, 1690, 'tree-2oval'], [580, 1700, 'tree-pine'],
		[1120, 1810, 'tree-2spears']]
		for (var i=0; i<region4.length; i++) {
			this.add.image(region4[i][0], region4[i][1], region4[i][2])
		}

//----------------------------------------------------------------------
		
		//adds cars depending on what was selected in the waiting room
		socket.on('all-cars', carColor => {
			addCars.style.display = 'none';
			if(carColor == 'green') {
				this.green = this.physics.add.sprite(280, 145, 'greencar')
				p3.style.display = 'flex';
			} else if (carColor == 'purple') {
				this.purple = this.physics.add.sprite(280, 195, 'purplecar')
				p4.style.display = 'flex';
			} else if (carColor == 'red') {
				this.red = this.physics.add.sprite(320, 195, 'redcar')
				p1.style.display = 'flex';
			} else if (carColor == 'blue') {
				this.blue = this.physics.add.sprite(320, 145, 'bluecar')
				p2.style.display = 'flex';
			}
		})

		var namesArray = [];
		socket.on('profile-usernames', name => {
			namesArray.push(name);

			if(namesArray.length==1){
				first.style.display = 'flex';
				first.innerText = namesArray[0];
				firstMoney.style.display = 'flex';
				firstMoney.innerText = 'money: $0'

			} else if (namesArray.length==2){
				first.style.display = 'flex';
				first.innerText = namesArray[0];
				firstMoney.style.display = 'flex';
				firstMoney.innerText = 'money: $0'
				second.style.display = 'flex';
				second.innerText = namesArray[1];
				secondMoney.style.display = 'flex';
				secondMoney.innerText = 'money: $0'


			} else if (namesArray.length==3){
				first.style.display = 'flex';
				first.innerText = namesArray[0];
				firstMoney.style.display = 'flex';
				firstMoney.innerText = 'money: $0'
				second.style.display = 'flex';
				second.innerText = namesArray[1];
				secondMoney.style.display = 'flex';
				secondMoney.innerText = 'money: $0'
				third.style.display = 'flex';
				third.innerText = namesArray[2];
				thirdMoney.style.display = 'flex';
				thirdMoney.innerText = 'money: $0'


			} else if (namesArray.length==4){
				first.style.display = 'flex';
				first.innerText = namesArray[0];
				firstMoney.style.display = 'flex';
				firstMoney.innerText = 'money: $0'
				second.style.display = 'flex';
				second.innerText = namesArray[1];
				secondMoney.style.display = 'flex';
				secondMoney.innerText = 'money: $0'
				third.style.display = 'flex';
				third.innerText = namesArray[2];
				thirdMoney.style.display = 'flex';
				thirdMoney.innerText = 'money: $0'
				fourth.style.display = 'flex';
				fourth.innerText = namesArray[3];
				fourthMoney.style.display = 'flex';
				fourthMoney.innerText = 'money: $0'
			}
		})

		var colorsArray = [];
		socket.on('profile-colors', color => {
			colorsArray.push(color);
		})







//----------------------------------------------------------------------
		this.currentNum = 0;

		roll.addEventListener('click', () => {
			//makes the roll button disappear for the user who clicked it
			roll.style.display = 'none';

			//generates a random number that gets sent to everyone
			this.num = Math.round(Math.random()*10);
			socket.emit('rando-num', roomName, this.num);
		});


		socket.on('number', num => {
			this.currentNum += num;

			//displays the number received
			spinNum.innerText = num;

	  	})


		this.b = 0;
	  	socket.on('blue-num', num => {
        	this.b += num;
        	for(var j=0; j<squares.length; j++) {
        		if(this.b == squares[j]){
        			card.style.display = 'flex';
        			card.innerText = words[j];
        			socket.emit('moneyb', roomName, j)
        		}
        	}
        })

	  	this.g = 0;
        socket.on('green-num', num => {
        	this.g += num;
        	for(var k=0; k<squares.length; k++) {
        		if(this.g == squares[k]){
        			card.style.display = 'flex';
        			card.innerText = words[k];
        			socket.emit('moneyg', roomName, k);
        		}
        	}
        })

        this.p = 0;
        socket.on('purple-num', num => {
        	this.p += num;
        	for(var l=0; l<squares.length; l++) {
        		if(this.p == squares[l]){
        			card.style.display = 'flex';
        			card.innerText = words[l];
        			socket.emit('moneyp', roomName, l);
        		}
        	}
        })

        this.r = 0;
        socket.on('red-num', num => {
        	this.r += num;
        	for(var m=0; m<squares.length; m++) {
        		if(this.r == squares[m]){
        			card.style.display = 'flex';
        			card.innerText = words[m];
        			socket.emit('moneyr', roomName, m);
        		}
        	}
        })


        socket.on('green-money-change', num => {
        	for(var s=0; s<colorsArray.length; s++){
        		if(colorsArray[s] == 'green'){
        			if(s==0){
        				firstMoney.innerText = `money: $${num}`;
        			} else if(s==1){
        				secondMoney.innerText = `money: $${num}`;
        			} else if(s==2){
        				thirdMoney.innerText = `money: $${num}`;
        			} else if(s==3){
        				fourthMoney.innerText = `money: $${num}`;
        			}
        		}
        	}
        })

        socket.on('blue-money-change', num => {
        	for(var t=0; t<colorsArray.length; t++){
        		if(colorsArray[t] == 'blue'){
        			if(t==0){
        				firstMoney.innerText = `money: $${num}`;
        			} else if(t==1){
        				secondMoney.innerText = `money: $${num}`;
        			} else if(t==2){
        				thirdMoney.innerText = `money: $${num}`;
        			} else if(t==3){
        				fourthMoney.innerText = `money: $${num}`;
        			}
        		}
        	}
        })

        socket.on('red-money-change', num => {
        	for(var u=0; u<colorsArray.length; u++){
        		if(colorsArray[u] == 'red'){
        			if(u==0){
        				firstMoney.innerText = `money: $${num}`;
        			} else if(u==1){
        				secondMoney.innerText = `money: $${num}`;
        			} else if(u==2){
        				thirdMoney.innerText = `money: $${num}`;
        			} else if(u==3){
        				fourthMoney.innerText = `money: $${num}`;
        			}
        		}
        	}
        })

        socket.on('purple-money-change', num => {
        	for(var v=0; v<colorsArray.length; v++){
        		if(colorsArray[v] == 'purple'){
        			if(v==0){
        				firstMoney.innerText = `money: $${num}`;
        			} else if(v==1){
        				secondMoney.innerText = `money: $${num}`;
        			} else if(v==2){
        				thirdMoney.innerText = `money: $${num}`;
        			} else if(v==3){
        				fourthMoney.innerText = `money: $${num}`;
        			}
        		}
        	}
        })



	}


	//function for moving the cars depending on the number
	moveBlue(i) {
		this.physics.moveTo(this.blue, this.tiles[i][0], this.tiles[i][1], 90);
      
        var distance = Phaser.Math.Distance.Between(this.blue.x, this.blue.y, this.tiles[i][0], this.tiles[i][1]);

        //halts the motion when car is close enough to destination
        if (this.blue.body.speed > 0) {
            if (distance < 3) {
                this.blue.body.reset(this.tiles[i][0], this.tiles[i][1]);
            }
        }
    }

    moveRed(i) {
		this.physics.moveTo(this.red, this.tiles[i][0], this.tiles[i][1], 90);
      
        var distance = Phaser.Math.Distance.Between(this.red.x, this.red.y, this.tiles[i][0], this.tiles[i][1]);

        //halts the motion when car is close enough to destination
        if (this.red.body.speed > 0) {
            if (distance < 3) {
                this.red.body.reset(this.tiles[i][0], this.tiles[i][1]);
            }
        }
    }

    movePurple(i) {
		this.physics.moveTo(this.purple, this.tiles[i][0], this.tiles[i][1], 90);
      
        var distance = Phaser.Math.Distance.Between(this.purple.x, this.purple.y, this.tiles[i][0], this.tiles[i][1]);

        //halts the motion when car is close enough to destination
        if (this.purple.body.speed > 0) {
            if (distance < 3) {
                this.purple.body.reset(this.tiles[i][0], this.tiles[i][1]);
            }
        }
    }

    moveGreen(i) {
		this.physics.moveTo(this.green, this.tiles[i][0], this.tiles[i][1], 90);
      
        var distance = Phaser.Math.Distance.Between(this.green.x, this.green.y, this.tiles[i][0], this.tiles[i][1]);

        //halts the motion when car is close enough to destination
        if (this.green.body.speed > 0) {
            if (distance < 3) {
                this.green.body.reset(this.tiles[i][0], this.tiles[i][1]);
            }
        }
    }

    update() {
        
        if(addCars.style.display == 'none'){

	        if(p2.style.display == 'flex') {
	        	this.moveBlue(this.b);
	        }

	        if(p3.style.display == 'flex') {
	        	this.moveGreen(this.g);
	        }

	        if(p4.style.display == 'flex') {
	        	this.movePurple(this.p);
	        }

	        if(p1.style.display == 'flex') {
	        	this.moveRed(this.r);
	        }
    	}
    }
}




//----------------------------------------------------------------------

//creates the phaser game
const config = {
	type: Phaser.CANVAS,
    width: 1400,
    height: 1930,
    backgroundColor: 0xADDC93,
    scene: [WaitingScene, StartScene],
    physics: {
    	default: 'arcade'
    }
}

const game = new Phaser.Game(config)

