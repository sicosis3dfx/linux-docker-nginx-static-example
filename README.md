# Plantilla para desplegar una página estática con Nginx en Docker

Esta plantilla está pensada para que los estudiantes puedan desplegar **sus propios códigos HTML/CSS/JS** en un servidor Linux (por ejemplo, AWS Linux en EC2) usando **Docker + Nginx**.

## Estructura

```
plantilla_despliegue_estatico_nginx_docker/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── nginx.conf
├── README.md
├── scripts/
│   ├── deploy.sh
│   └── stop.sh
└── site/
    ├── index.html
    └── assets/
        └── styles.css
```

## Opción rápida para estudiantes

1. Copia **tu propio código estático** dentro de la carpeta `site/`.
   - Debe existir un archivo `index.html`.
   - Puedes añadir carpetas como `css`, `js`, `img`, `assets`, etc.
2. Desde esta carpeta, ejecuta:

```bash
chmod +x scripts/*.sh
./scripts/deploy.sh
```

3. Abre en tu navegador:

- `http://localhost:8080` (si trabajas local)
- `http://IP_PUBLICA_EC2:8080` (si trabajas en un servidor y tienes el puerto abierto)

## Si quieren usar un repositorio Git/GitHub propio

### Camino sencillo
- Clona tu repositorio en otro directorio.
- Copia el contenido estático al directorio `site/`.

Ejemplo:

```bash
git clone https://github.com/USUARIO/MI-REPO.git
cp -r MI-REPO/* site/
./scripts/deploy.sh
```

### Camino con enlace simbólico (avanzado)
Si tu repositorio tiene una estructura limpia y quieres trabajar directamente con él:

```bash
rm -rf site
ln -s /ruta/a/tu/repositorio site
./scripts/deploy.sh
```

## Instalar Docker y Docker Compose

1. Instala Docker

```bash
sudo yum update -y
sudo yum install -y docker
```

2. Habilita Docker Compose y permisos 

```bash
sudo systemctl enable --now docker
sudo usermod -a -G docker ec2-user
sudo mkdir -p /usr/libexec/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m) -o /usr/libexec/docker/cli-plugins/docker-compose
sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
```

3. Comprueba Docker y Docker Compose
```bash
docker -h 
docker compose -h
```



## Despliegue con Docker Compose

```bash
docker compose up --build -d
```

Para detener:

```bash
docker compose down
```

## Despliegue con Docker clásico

```bash
docker build -t sitio-estatico-nginx .
docker run -d --name sitio-estatico -p 8080:80 sitio-estatico-nginx
```

## Si trabajan en AWS EC2
Asegúrate de revisar:

- que Docker esté instalado y funcionando,
- que el servidor esté accesible,
- que el **Security Group** permita el puerto que usarás (por ejemplo, `8080` o `80`),
- y que el firewall del sistema operativo no bloquee el tráfico.

## Comandos útiles

Ver contenedores:

```bash
docker ps
```

Ver logs:

```bash
docker logs sitio-estatico
```

Entrar al contenedor:

```bash
docker exec -it sitio-estatico sh
```

Detener contenedor:

```bash
./scripts/stop.sh
```

## Recomendaciones para estudiantes
- Mantén siempre un `index.html` funcional.
- Comprueba bien las rutas relativas de CSS, JS e imágenes.
- Si cambias archivos, reconstruye el contenedor con `docker compose up --build -d`.
- Si estás en EC2 y no carga en el navegador, revisa **puerto + Security Group + firewall + IP pública**.

## Extensiones posibles para clases futuras
- Cambiar el puerto a `80` para producción.
- Añadir HTTPS con proxy inverso.
- Publicar una SPA con fallback a `index.html`.
- Servir múltiples sitios estáticos.
