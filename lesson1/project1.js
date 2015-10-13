//an array of dart IDs
var darts = ['dart1', 'dart2', 'dart3'];
//an array of player score element IDs
var playerScore = ['player1score', 'player2score'];

//game object
var game =
{
    //set a property on the game object to control the current player by using an index to
    //access the correct player object in the game.players array of player objects
    currentPlayerIndex: 0,
	//this game object has a property called 'players' containing an array of player objects; 
	//each player object has some properties
	players : 
	[ 
		{ name: 'Player 1', runningTotal: 301, turn: [], winner: false, busted: false }, 
		{ name: 'Player 2', runningTotal: 301, turn: [], winner: false, busted: false } 
	]
}

//on clicking on the dart board
function startGame()
{
	playerSetup();
	game.players[0].name = prompt("Player 1, please enter your name.", "Player 1");
	game.players[1].name = prompt("Player 2, please enter your name.", "Player 2");
	document.getElementById("currentPlayer").innerHTML=game.players[game.currentPlayerIndex].name + "'s turn";
	document.getElementById("player1name").innerHTML="Name: " + game.players[0].name;
	document.getElementById("player2name").innerHTML="Name: " + game.players[1].name;
	document.getElementById("player1score").innerHTML="Score: 301";
	document.getElementById("player2score").innerHTML="Score: 301";
	
}

function playerSetup()
{
	game.currentPlayerIndex = 0;
	game.players[0].name = "Player 1";
	game.players[1].name = "Player 2";
	game.players[0].runningTotal = 301;
	game.players[1].runningTotal = 301;
	game.players[0].turn = [];
	game.players[1].turn = [];
	game.players[0].winner = false;
	game.players[1].winner = false;
	game.players[0].busted = false;
	game.players[1].busted = false;
	document.getElementById(darts[0]).style.display="inline";
	document.getElementById(darts[1]).style.display="inline";
	document.getElementById(darts[2]).style.display="inline";
}


//on pressing the Register Score button...
function doTurn()
{
    if(game.checkingForWin)
    {
    
    }
	//call updateScore passing in the current player
	else if(!updateScore(game.players[game.currentPlayerIndex]))
	{
		/*if the function returns false(which would happen if the player reached 3 goes or they busted) 
		execute switchPlayer() */
	    switchPlayer();
	}
}

function switchPlayer()
{    
	//empty the current player's turn array ready for their text turn
    game.players[game.currentPlayerIndex].turn = [];
	document.getElementById(playerScore[game.currentPlayerIndex]).innerHTML = "Score: " + (game.players[game.currentPlayerIndex].runningTotal);

	//switch player
	game.currentPlayerIndex = game.currentPlayerIndex == 0 ? 1 : 0;
		
	document.getElementById(darts[0]).style.display="inline";
	document.getElementById(darts[1]).style.display="inline";
	document.getElementById(darts[2]).style.display="inline";
	document.getElementById("currentPlayer").innerHTML=game.players[game.currentPlayerIndex].name + "'s turn";
}

//change this function, it does too much. break it up. e.g. continueTurn() to determine if it's still
//the current player's turn or not
function updateScore(player)
{
	document.getElementById("winQuestion").innerHTML = "Did " + player.name + " end on a double?";
	player.busted = false;
	document.getElementById("bustedMsg").innerHTML="";
	//hide a dart each time a score in input, i.e. a throw is had
    document.getElementById(darts[player.turn.length]).style.display="none";
	
	//get the value input from the form, make it an integer and append it to the player's turn array
	player.turn.push(parseInt(scoreForm.throwScore.value));
	
	//sum the values in the player's turn array and store in the turnTotal variable
	var turnTotal = player.turn.reduce(function(a, b) { return a + b; }, 0);
	
	//update the element on the page to display the running total after each throw
    document.getElementById(playerScore[game.currentPlayerIndex]).innerHTML = "Score: " + (player.runningTotal - turnTotal);

	if (player.runningTotal - turnTotal == 0)
	{
		//ask if player doubled out or not. Either way, doubleOutQuestion() will be called taking current player as arg
		game.checkingForWin = true;
		document.getElementById("winQuestion").innerHTML = "Did " + player.name + " end on a double?";
		document.getElementById("doubleOutCheck").style.display="block";
		return true;
	}

	bustedCheck(player, turnTotal);
	
	if (player.winner)
	{
		return true;
	}
	else if (player.turn.length < 3 && !player.busted)
	{
		return true;
	}
	else if(player.busted)
	{
		return false;
	}
	else
	{
		player.runningTotal -= turnTotal;
	}
	
	return false;
}

function doDoubleOut(winner)
{
	var player = game.players[game.currentPlayerIndex];
    if(game.checkingForWin)
    {
		game.checkingForWin = false;
		if (winner)
		{
			player.winner = true;
			document.getElementById("currentPlayer").innerHTML="Congratulations! " + player.name + " wins the game";
		}
		else
		{
			player.busted = true;
			document.getElementById("bustedMsg").innerHTML="Oops, " + player.name + " busted.";
			switchPlayer();
		}
		document.getElementById("doubleOutCheck").style.display="none";
	}
}

function bustedCheck(player, turn_total)
{
	if (player.runningTotal - turn_total == 1 || player.runningTotal - turn_total < 0)
	{
		//alert("Oops, " + player.name + " busted.");
		document.getElementById("bustedMsg").innerHTML = "Oops, " + player.name + " busted.";
		player.busted = true;
	}
}




/*function winCheck(player, turn_total)
{ 
	if (player.runningTotal - turn_total == 0)
	{
		//document.getElementById("doubleOutLabel").innerHTML="Did " + player.name + " end on a double?";
		//document.getElementById("doubleOutCheck").style.visibility="visible";
		
		
		if ()
		{
			player.winner = true;
			document.getElementById("currentPlayer").innerHTML="Congratulations! " + player.name + " wins the game";
		}
		else
		{
			player.busted = true;
			document.getElementById("bustedMsg").innerHTML="Oops, " + player.name + " busted.";
			//alert("Oops, " + player.name + " busted.");
		}
	}
	//document.getElementById("doubleOutCheck").style.visibility="hidden";
} */


//can pass in the turn total to the winCheck and bustedCheck functions
//OR can define a function called sum(array) which does the .reduce function inside, so you can
//call sum wherever you need it and it will be shorter line of code than if you had to 
//rewrite .reduce