Dots = new Mongo.Collection("dots");

if (Meteor.isClient) {

  var canvas,
  ctx,
  colors = ['#FF6600', '#0099FF', '#BCBCBC', '#3D3D3D'],
  dots = [],
  maxDots = 100;

  function Dot() {
      this.alive = true;
      this.x = Math.round(Math.random() * canvas.width);
      this.y = Math.round(Math.random() * canvas.height);
      this.size = Math.round(Math.random() * 7);
      this.velocity = {
          x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7,
          y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7
      }
      this.alpha = 0.01;
      this.hexColor = colors[Math.round(Math.random() * (colors.length - 1))];
      this.rgbaStringColor = getRGBA(this.hexColor, this.alpha);
  }

  function getRGBA(hex, alpha) {
      var r = parseInt(hex.substring(1, 3), 16),
          g = parseInt(hex.substring(3, 5), 16),
          b = parseInt(hex.substring(6, 8), 16),
          a = alpha;
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  }

  Dot.prototype.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = this.rgbaStringColor;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
  }

  /*updates both colors and position of the dot*/
  Dot.prototype.update = function () {
      if (this.alpha < 0.7) {
          this.alpha += 0.01;
          this.rgbaStringColor = getRGBA(this.hexColor, this.alpha);
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      if (this.x > (canvas.width) + 5 || this.x < -5) {
          this.alive = false;
      }
      if (this.y > (canvas.height) - 15 || this.y < -5) {
          this.alpha -= 0.05;
          if (this.alpha <= 0.1) {
              this.alive = false;
          }
      }
  }

  function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); //start from scratch
      for (var i = 0; i < dots.length; i++) { 
          dots[i].draw(); // draw each dot
          dots[i].update(); //update the position of each dot
      }
      createDots(); // make new dots to replace the dead ones
      // push the dots array into the Dots collection
      window.requestAnimationFrame(update); // redraw the canvas and recurse
  }

  function createDots() {
      // pull the dots from the Dots collection into the dots array
      dots = dots.filter(function (dot) { // get all the alive dots
          return dot.alive;
      });
      for (var length = dots.length; length < maxDots; length++) { // add new dots as some have died
          dots.push(new Dot());
      }
  }

  function init() {
      createDots();
      update();
  }


  function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = 300;
  }

  document.addEventListener('DOMContentLoaded', function () {
      canvas = document.getElementById('universe');
      ctx = canvas.getContext('2d');
      setCanvasSize();
      init();
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
