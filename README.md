# firebase-postit
Un système de post-it basé sur un stockage des données dans [firebase](https://www.firebase.com/).

[démo](http://codepen.io/polinux/pen/OVQPea)

#### Usages

HTML：

Entre les balises HEAD
```html
<link type="text/css" rel="stylesheet" href="./css/fbPostIt.css" />
```

Dans le BODY
```html
<button id="creaPostIt" class="icon-postit">un click pour un post-it ...</button>
<script src="https://cdn.firebase.com/js/client/2.2.7/firebase.js"></script>
<script type="text/javascript" src="./js/fbPostIt.js"></script>
```

```html
<script>
	appPostIt.setBase( 'https://px-flux.firebaseio.com/postit/demo' );
	appPostIt.setLanceur( document.getElementById('creaPostIt') );
</script>
```


