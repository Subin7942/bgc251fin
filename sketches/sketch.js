let video;
let pixelSize = 6;
let videoSize = 40;
let hitDetected = false;
// 괴물이 총알에 맞았는지 여부 기억하는 변수 false면 총알에 맞지 않은 상태이고 true면 총알에 맞음
let attackNum = 0;
let Hp = 25;
let stars = [];
let starCount = 100;
let enemies = [];
let enemyCount = 15;
let heroHp = 50;
let damage = false;

function setup() {
  createCanvas(800, 600);
  // 비디오 만들고 크기 조정 뒤 없애기(나중에 픽셀로 재현)
  video = createCapture(VIDEO, { flipped: true });
  video.size(videoSize, videoSize);
  video.hide();

  // 총알 불러오기
  bullet.makeBullet(-10, -10, 30);
  // 별 여러 개 생성
  for (let idxS = 0; idxS < starCount; idxS++) {
    let x = random(width);
    let y = random(height);
    let speed = random(0.5, 2);
    let s = Object.create(star);
    s.makeStar(x, y, speed);
    stars.push(s);
  }
  // 적 여러 개 생성
  for (let idxE = 0; idxE < enemyCount; idxE++) {
    let x = random(width);
    let y = random(height);
    let speed = random(10, 15);
    let e = Object.create(enemy);
    e.makeEnemy(x, y, speed);
    enemies.push(e);
  }
}

function draw() {
  // 비디오의 픽셀 정보 불러오기
  video.loadPixels();
  // console.log(video);
  // console.log(video.pixels.length);

  background('black');

  // 생성한 별을 업데이트하고 랜더링
  for (let star of stars) {
    star.update();
    star.render();
    if (star.position.x < -10) {
      star.position.x = width + random(10, 100);
      star.position.y = random(height);
    }
  }
  // 생성한 적을 업데이트하고 랜더링
  for (let enemy of enemies) {
    enemy.update();
    enemy.render();
    if (enemy.position.x < -10) {
      enemy.position.x = width + random(10, 100);
      enemy.position.y = random(0, height);
    }
  }
  // 총알과 영웅 업데이트 및 렌더링
  bullet.update();
  bullet.render();
  hero.makeHero(50, mouseY);
  hero.render();

  // 영웅이 이겼을 때
  if (attackNum >= Hp) {
    fill('black');
    rect(0, 0, width, height);
    fill('skyblue');
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Monster is dead!', width / 2, height / 2);
    noLoop();
    return;
  }
  // 괴물이 이겼을 때
  if (heroHp <= 0) {
    fill('black');
    rect(0, 0, width, height);
    fill('red');
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Game Over', width / 2, height / 2);
    noLoop();
    return;
  }

  // 화면에서 맨 왼쪽과 괴물 사이의 여백 위치 계산
  let spaceX = width - pixelSize * video.width;
  let spaceY = height / 2 - (pixelSize * video.height) / 2;

  // 영웅과 적의 거리를 계산하고 영웅이 적에게 맞았는지 판단
  let damageThisFrame = false;

  for (let enemy of enemies) {
    let distanceHE = dist(
      hero.position.x,
      hero.position.y,
      enemy.position.x,
      enemy.position.y
    );
    if (distanceHE < 40) {
      damageThisFrame = true;
    }
    if (damageThisFrame || damage) {
      hero.heroByAttacked();
    } else {
      hero.render();
    }
    if (damageThisFrame && !damage) {
      heroHp--;
      damage = true;
    } else if (!damageThisFrame) {
      damage = false;
    }
  }

  // 영웅의 체력바
  stroke('black');
  strokeWeight(2);
  fill('white');
  textSize(15);
  textAlign(LEFT, CENTER);
  text("Hero's Hp", 10, 30);
  let heroHpIdx = map(heroHp, 0, 50, 0, spaceX - 100);
  fill('orange');
  rect(10, 10, heroHpIdx, 10);
  stroke('white');
  strokeWeight(1);
  noFill();
  rect(9, 9, spaceX - 99, 11);

  // 괴물의 이름과 체력바
  stroke('black');
  strokeWeight(2);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(20);
  text('Monster', spaceX + (video.width * pixelSize) / 2, spaceY - 10);
  text(
    'Hp' + (Hp - attackNum),
    spaceX + (video.width * pixelSize) / 2,
    spaceY + video.height * pixelSize + 30
  );
  let atIdx = map(attackNum, 0, Hp, 0, width - spaceX);
  fill('red');
  rect(spaceX + atIdx, height - spaceY + 5, width - spaceX, 10);

  // draw 내에서 프레임이 계속 반복되고 있고 반복되는 프레임들 사이에서 괴물이 총알에 맞았는지 판단하는 변수
  let hitThisFrame = false;

  // 비디오의 픽셀 정보를 이용해 괴물 만들기
  for (let idx = 0; idx < video.pixels.length / 4; idx++) {
    let column = idx % video.width;
    let row = floor(idx / video.width);
    let r = video.pixels[idx * 4];
    let g = video.pixels[idx * 4 + 1];
    let b = video.pixels[idx * 4 + 2];
    let a = video.pixels[idx * 4 + 3];
    fill(r, g, b, a);

    // 괴물의 위치를 지정한 여백부터 위치하게 설정하는 것
    let videoX = spaceX + pixelSize * column;
    let videoY = spaceY + pixelSize * row;
    let distanceBM = dist(bullet.position.x, bullet.position.y, videoX, videoY);

    // 총알과 사악한 괴물의 거리가 5가 되면 프레임에서 총알이 맞았다는 것을 인식
    if (distanceBM < 5) {
      hitThisFrame = true;
    }
    // 괴물이 총알에 맞고 빨갛게 타격 효과 생김
    if (hitDetected || hitThisFrame) {
      fill(r, 0, 0, a);
    } else {
      fill(r, g, b, a);
    }

    // 지정한 위치와 지정한 픽셀 크기만큼 괴물의 형태 그리기
    noStroke();
    square(videoX, videoY, pixelSize);
  }

  // 괴물이 총알에 맞았다는 것을 인식하고 공격횟수가 오른 뒤 총알에 맞은 사실을 기억한다, 기억을 하기 전에만 공격횟수가 오르고 기억한 이후에는 오르지 않게 해 한 프레임 당 총알이 지나가며 인식된 횟수만큼 공격횟수가 여러번 오르는 것을 방지한다
  // 이렇게 하지 않으면 한 프레임 당 총알이 지나가며 총을 한 번 쏜 것과 상관없이 hitThisFrame이 인지한 만큼 공격 횟수가 오르게 된다
  if (hitThisFrame && !hitDetected) {
    attackNum++;
    hitDetected = true;
  }

  // 총알이 완전히 지나가면 공격 사실을 잊음, 다시 프레임에서 공격 여부를 판단 후 기억해야 함
  if (bullet.position.x > width) {
    hitDetected = false;
  }
}

// 마우스를 클릭할 때마다 총알의 x 위치는 50에 고정하고 y 위치는 마우스 y 위치로 설정
function mousePressed() {
  bullet.position.set(50, mouseY);
}
