(()=>{const e=document.getElementById("create-game"),t=document.getElementById("refresh-invites"),a=document.getElementById("start-game"),n=document.getElementById("create"),d=document.getElementById("invitation"),s=document.getElementById("game"),r=document.getElementById("gameStatus"),c=document.getElementById("combination"),l=e=>{"cards clicked"===e.getAttribute("class")?(e.setAttribute("style","border:0mm "),e.setAttribute("class","cards")):(e.setAttribute("style","border:4mm ridge rgba(170, 50, 220, .6) "),e.setAttribute("class","cards clicked"))},o=document.getElementById("card1"),m=document.getElementById("card2"),u=document.getElementById("card3"),y=document.getElementById("card4"),g=document.getElementById("card5"),p=document.getElementById("card6"),b=document.getElementById("card7"),E=document.getElementById("card8"),h=document.getElementById("card9"),k=document.getElementById("card10"),v=document.getElementById("card11"),I=document.getElementById("card12"),A=document.getElementById("card13");o.addEventListener("click",(()=>{l(o)})),m.addEventListener("click",(()=>{l(m)})),u.addEventListener("click",(()=>{l(u)})),y.addEventListener("click",(()=>{l(y)})),g.addEventListener("click",(()=>{l(g)})),p.addEventListener("click",(()=>{l(p)})),b.addEventListener("click",(()=>{l(b)})),E.addEventListener("click",(()=>{l(E)})),h.addEventListener("click",(()=>{l(h)})),k.addEventListener("click",(()=>{l(k)})),v.addEventListener("click",(()=>{l(v)})),I.addEventListener("click",(()=>{l(I)})),A.addEventListener("click",(()=>{l(A)}));const L=document.getElementById("showCards"),B=document.getElementById("refresh"),P=document.getElementById("submit"),w=document.getElementById("skip");e.addEventListener("click",(async()=>{e.setAttribute("style","display:none"),a.setAttribute("style","display:block");const t=await axios.get("/create");console.log(t,"hi");const d=document.createElement("p");for(d.innerHTML="You are Player 1",n.appendChild(d),i=0;i<3;i++){const e=document.createElement("select");n.appendChild(e),e.setAttribute("id",`player${i+2}`);const a=document.createElement("option");a.setAttribute("value",""),a.setAttribute("disabled",""),a.setAttribute("id",`Player${i+2}`),a.setAttribute("selected",""),a.innerHTML=`Player${i+2}`,e.appendChild(a),t.data.forEach((t=>{const a=document.createElement("option");a.setAttribute("value",t.id),a.innerHTML=t.name,e.appendChild(a)}))}})),a.addEventListener("click",(async()=>{const e=document.getElementById("player2").value,t=document.getElementById("player3").value,a=document.getElementById("player4").value;console.log(document.cookie.split("=")[1]),console.log(e,t,a);const d={player2Id:e,player3Id:t,player4Id:a};console.log(d),await axios.post("/invite",d),n.setAttribute("style","display:none")})),t.addEventListener("click",(async()=>{d.setAttribute("styles","display:block");const e=await axios.get("/invites");console.log(e),e.data.forEach((e=>{if("pending"===e.gameState){const t=document.createElement("div"),a=document.createElement("button");a.innerHTML="Join Game",t.innerHTML=`You got a game invite. for game ${e.id}`,a.setAttribute("id",e.id),a.setAttribute("class","game-invite-button"),d.appendChild(t),t.appendChild(a),a.addEventListener("click",(()=>{(async e=>{s.setAttribute("style","display:block"),d.setAttribute("style","display:none");const t=await axios.post("/init",{gameId:e});console.log(t),console.log(t.data.gameData.gameState),"pending"===t.data.gameData.gameState&&(r.innerHTML=`Waiting for ${t.data.waitingForNumOfPlayers} players`),"In Progress"===t.data.gameData.gameState&&(r.innerHTML=`Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ${t.data.startingIndex+1} who has 3 of diamonds.<br>You are Player ${t.data.playerNumber+1}`,document.querySelectorAll(".cards").forEach(((e,a)=>{e.setAttribute("src",`${t.data.playerCards[a].link}`)})))})(e.id)}))}}))}));const f=async()=>{const e=await axios.get("/cards");console.log(e),document.querySelectorAll(".cards").forEach(((t,a)=>{a<e.data.length?t.setAttribute("src",`${e.data[a].link}`):t.setAttribute("style","display:none")}))};L.addEventListener("click",f);const $=async()=>{const e=await axios.get("/refresh");console.log(e);const t=document.cookie.split("; ").find((e=>e.startsWith("startingPlayer="))).split("=")[1],a=document.cookie.split("; ").find((e=>e.startsWith("playerNumber="))).split("=")[1];let n=`Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ${Number(t)+1} who has 3 of diamonds.<br>You are Player ${a}`;null===e.data[0].playerId&&null===e.data[0].skipCounter?n+=`<br>It is Player ${Number(t)+1}'s turn`:3===e.data[0].skipCounter?n+="<br>It is your turn. As all previous players have skipped, you can put down a new combination":2===e.data.length?n+=`The combination is ${e.data[0].cardsPlayed.length} cards, ${e.data[0].player} has played his turn, it is the next player's turn<br>Last Combination played is: ${e.data[0].cardsPlayed} `:n+=`The combination is ${e.data[1].cardsPlayed.length} cards, ${e.data[0].player} has played his turn, it is the next player's turn<br>Last Combination played is: ${e.data[1].cardsPlayed} `,r.innerHTML=n,e.data[e.data.length-1].winner&&(c.innerHTML=`The game has ended, and ${e.data[0].player} has won the game`)};B.addEventListener("click",$),P.addEventListener("click",(async()=>{console.log("clicked");const e=document.querySelectorAll(".cards"),t=[],a=[];console.log(e),e.forEach((e=>{if(e.getAttribute("src")){console.log(e.getAttribute("src"));const n=e.getAttribute("src").split("cards/")[1].split(".png")[0],d=n.split("_")[2],i=n.split("_")[0];let r;switch(i){case"ace":r=1;break;case"king":r=13;break;case"queen":r=12;break;case"jack":r=11;break;default:r=i}"cards clicked"===e.getAttribute("class")?(s.removeChild(e),console.log("played",e),t.push({name:i,rank:r,suit:d,link:e.getAttribute("src")})):"cards"===e.getAttribute("class")&&e.getAttribute("src")&&(console.log("remained",e),a.push({name:i,rank:r,suit:d,link:e.getAttribute("src")}))}})),await axios.post("/playRound",{cardsPlayed:t,cardsRemaining:a}),f(),$(),0==a.length&&(c.innerHTML="Congrats you have won the game")})),w.addEventListener("click",(async()=>{await axios.get("/skip")}))})();