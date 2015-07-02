/**
 * fbPostIt.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       29/06/2015
 * @version    0.1.0
 * @revision   $0$
 *
 * @date   revision   marc laville  xx/xx/xxxx : zzzzz
 *
 * A faire
 * - gestion d'une corbeille
 *
 * Gestion des post-it et enregistrement dans firebase
 */

 var appPostIt = (function(contenaire){
 
	var basePostIt = null,
		/**
		 * dragging stuf
		 */
		draggable = function( node ) {
			var onEvtDragStart = function( event ) {

					event.dataTransfer.setData( 'position', JSON.stringify( { x: event.screenX, y: event.screenY } ) );
					event.dataTransfer.effectAllowed = 'move';
					// make it half transparent
					node.style.opacity = .6;
					node.style.top = [ node.style.top || event.screenY - window.scrollY, 'px' ].join('');

					return;
				},
				onEvtDragEnd  = function( event ) {
					var jsonData = event.dataTransfer.getData('position'),
						data = JSON.parse(jsonData),
						eltStyle = node.style;

					eltStyle.left = [ event.screenX - data.x + parseInt( '0' + eltStyle.left ), 'px' ].join('');
					eltStyle.top = [ event.screenY - data.y + parseInt( '0' + eltStyle.top ), 'px' ].join('');

					eltStyle.opacity = 1;

				return;
			}
	
			node.style.position = 'absolute';
			node.setAttribute( 'draggable', 'true' );
			node.addEventListener( 'dragstart', onEvtDragStart, false );
			node.addEventListener( 'dragend', onEvtDragEnd, false );

			return node;
		},
		/**
		 * post-it factory
		 */
		creePostIt = function( param ){
			var element = document.createElement("div"), // le post-it
				delButton = element.appendChild( document.createElement("button") ), // le bouton de fermeture
				textArea = element.appendChild( document.createElement("textarea") ), // le champ de saisie du texte
				bd = basePostIt, // On garde une référence sur la base pour la fonction sauvPostIt
				bdNode = param.id || null,
				reflectChange = function(dataSnapshot) {
					var data = dataSnapshot.val();
					
					if( data ) {
						textArea.value = data.text;
						element.style.left = data.x;
						element.style.top = data.y;
					} else {
						element.parentNode.removeChild(element);
					}
					return data;
				},
				delPostIt  = function( ) {
					return bdNode.remove();
				},
				sauvPostIt  = function( ) {
					var modele = {
						  x: element.style.left,
						  y: element.style.top,
						  text: textArea.value
						};

					if( bdNode ) {
						bdNode.update(modele);
					} else {
						bdNode = bd.push(modele);
						bdNode.on( 'value', reflectChange );
					}

					return bdNode;
				},
				// Enregistre la position du post-it et le place au premier plan
				dragendPostIt  = function() {
					sauvPostIt();
					return ( contenaire.lastChild === element ) ? element : contenaire.appendChild( contenaire.removeChild(element) );
				};
			
			if(bdNode) {
				bdNode.on( 'value', reflectChange );
			}
			element.className = 'post-it';
			element.style.left = param.x;
			element.style.top = param.y;
			textArea.value = param.text || '';
			
			// staf de drag
			draggable( element );
			element.addEventListener( 'dragend', dragendPostIt );

			textArea.addEventListener( 'blur', sauvPostIt );
			
			delButton.addEventListener( 'click', delPostIt, false );
			delButton.textContent = 'X';
			
			// contournement du fait que le caret n'a pas un comportement normal, lorsqu'il est fils d'un élèment draggable
			textArea.addEventListener( 'mouseover', function() {
				element.setAttribute( 'draggable', undefined );
			});
			textArea.addEventListener( 'mouseout', function() {
				element.setAttribute( 'draggable', true );
			});

			return element;
		},
		ajoutPostIt = function( param ){
		
			if(!basePostIt) {
				return null;
			}

			param = param || {};
			if( param.x == undefined )
				param.x = '20px';
			if( param.y == undefined )
				param.y = '20px';

			return contenaire.appendChild( creePostIt( param ) );
		},
		imgDock = function(){
			var img = li.appendChild( document.createElement("img") );
			
			img.setAttribute('src', './css/images/postit.png');
			img.addEventListener( 'dblclick', ajoutPostIt );
			
			return img;
		},
		lanceurDefault = function(){
			var button = document.createElement("button");
			
			button.addEventListener( 'dblclick', ajoutPostIt );
			
			return button;
		},
		postitFromDataSnapshot = function( dataSnapshot ){
			var key = dataSnapshot.key();
				val = dataSnapshot.val();
			
			return ajoutPostIt( { id: basePostIt.child(key), x:val.x, y:val.y, text: val.text } );
		},
		setLanceur = function( unElement ) {
			var isNode = unElement instanceof Node;
			
			if(isNode) {
				unElement.addEventListener( 'click', ajoutPostIt );
			}
			return isNode;
		},
		setBase = function( unPath ) {
			basePostIt = new Firebase(unPath);
			basePostIt.on( 'child_added', postitFromDataSnapshot );
		};

	contenaire = contenaire || document.body;
	
	return {
		setBase : setBase,
		setLanceur : setLanceur
	}
 }());
