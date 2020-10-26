# Art Génératif (p5.js)

## :speech_balloon: Temps d'attente dans les différentes agences de l'OPT NC

Projet de stage étudiant autour de la visualisation des données recueillies par les différentes agences de l'OPT NC.

La visualisation est réalisée grâce à la librairie Javascript p5.js <br>
<https://p5js.org/>

Ce projet utilise l'API REST des temps d'attente en agence OPT.nc <br>
<https://github.com/adriens/opt-temps-attente-agences-api>

## :gear: Setup du projet

```sh
git clone https://github.com/adriens/web-generative-art-temps-attente-opt.git
cd web-generative-art-temps-attente-opt
```

```sh
docker build -t orbit .
docker run --name opt-temps-attente-agences-api -d -p 8081:8081 rastadidi/opt-temps-attente-agences-api
docker run --name opt-temps-attente-agences-viz-orbit -d -p 80:80 orbit
docker ps
```

## :fireworks: Pour accéder aux visualisations

* <http://localhost>
* <http://localhost/orbit.min.html> (Version allégée de metriques)
