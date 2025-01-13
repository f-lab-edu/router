import createRouter from './route/router.js';

const container = document.querySelector('main');

// home, mypage에 보줄 간단한 text를 삽입하는 코드
const pages = {
  home: () => container.innerText = "Home Page!",
  myPage: () => container.innerText = "My Page!",
  beverage: () => container.innerText = "Beverage!",
  menu: (params) => container.innerText = `${params.name} ${params.detailName}`
}

const router = createRouter();

router.addRoute("#/", pages.home)
  .addRoute("#/my-page", pages.myPage)
  .addRoute("#/beverage", pages.beverage)
  .addRoute("#/beverage/:name/:detailName", pages.menu)
  .start();

// 버튼을 클릭했을 때 클릭된 버튼의 데이터 속성에있는 경로를 라우터에 전달해주는 이벤트리스너
window.addEventListener("click", event => {
  if(event.target.matches("[data-navigate]")) {
    router.navigate(event.target.dataset.navigate);
  }
});