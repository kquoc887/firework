const WIDTH = (window.innerWidth > 0) ? window.innerWidth : screen.width;
const HEIGHT = (window.innerHeight > 0) ? window.innerHeight : screen.height;
const PARTICLE_SIZE = 7;
const PARTICLE_CHANGE_SIZE_SPEED = 0.1;
const PARTICLE_CHANGE_SPEED = 0.5;
const ACCELERATION = 0.12;
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.07;
const PARTICLE_MIN_SPEED = 10;
const NUMBER_PARTICLE_PER_BULLET = 20;

class Particle {
    constructor(Bullet, deg) {
        this.bullet = Bullet;
        this.deg = deg;
        this.ctx = this.bullet.ctx;
        this.color = this.bullet.color;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;
         // { x: 10,y: 10, alpha: 1, size : 10 }
        this.dots = [];
    }

    update() {
        this.speed -= PARTICLE_CHANGE_SPEED;
        if (this.speed < 0) {
            this.speed = 0;
        }   
        // increase fall speed.
        this.fallSpeed += ACCELERATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;
        //calculate postion.
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > PARTICLE_CHANGE_SIZE_SPEED) {
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;            
        }

        if (this.size > 0) {
            this.dots.push(
                { x: this.x ,y: this.y, alpha: 1, size : this.size }
            );
        }

        this.dots.forEach( dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });

        this.dots = this.dots.filter( dot => {
            return dot.size > 0;
        });

        if (this.dots.length == 0) {
            this.remove();
        }
    }

    remove() {
        this.bullet.particles.splice( this.bullet.particles.indexOf(this), 1 );
    }

    draw() {
        // console.log(this.color);
        // console.log(this.x, this.y)
        this.dots.forEach( dot => {
            this.ctx.fillStyle = 'rgba('+this.color+','+dot.alpha+')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })
        // this.ctx.fillStyle = '#ff0000';
        // this.ctx.beginPath();
        // this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        // this.ctx.fill();
    }
}

class Bullet {
    constructor(Firework) {
        this.firework = Firework;
        this.ctx = Firework.ctx;
        this.x = (Math.random() * WIDTH / 2) + 10;
        this.y = Math.random() * HEIGHT / 2;
        this.color = Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255);
        // console.log(Math.floor(Math.random() + 255));
        this.particles = [];
        //Create one particle.
        let bulletDeg = (Math.PI * 2) / NUMBER_PARTICLE_PER_BULLET;
        for (let i = 0; i < NUMBER_PARTICLE_PER_BULLET; i++) {
            let newParticle = new Particle(this, i *bulletDeg);
            this.particles.push(newParticle);            
        }
    }

    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach( particle => particle.update() );
    }

    remove() {
        this.firework.bullets.splice( this.firework.bullets.indexOf(this), 1);
    }

    draw() {
        this.particles.forEach( particle => particle.draw() );

    }
}

class Firework {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        // this.canvas.append('<marquee>Hello</marquee>')
        document.getElementsByClassName('container-body')[0].appendChild(this.canvas);
        // console.log(containerBody);
        // containerBody.append(this.canvas);
        this.bullets = [];
        setInterval(() => {
            //Create new bullet
            let newBullet = new Bullet(this);
            this.bullets.push(newBullet);
        }, 1200);
        this.loop();
    }

    loop() {
        // console.log('loop');
        this.bullets.forEach( bullet => bullet.update() );
        this.draw();
        setTimeout(() => {this.loop();}, 20);
    }

    clearScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    draw() {
        this.clearScreen();
        this.bullets.forEach( bullet => bullet.draw() );
    }
}

var f = new Firework();