import { initRender } from '../Renderer';
import Article from '../pages/Article';
import Main from '../pages/Main';
import MyPage from '../pages/MyPage';

class Router {
  private static instance: Router;
  private routes: Map<string, () => string>;
  private $app: HTMLElement;

  // 싱글톤 라우터의 생성자 함수는 Map 자료구조를 가진 routes를 만든다. (경로 -> 페이지(컴포넌트))
  private constructor() {
    this.routes = new Map([
      ['/', () => Main()],
      ['/my-page', () => MyPage()],
      ['/articles', () => Article()]
    ]) as Map<string, () => string>;

    this.$app = document.getElementById('app') as HTMLElement; 

    // 전역 객체인 window의 popstate 이벤트에 render 함수를 연결(뒤로가기, 앞으로 가기 감지)
    window.addEventListener('popstate', () => {
      this.render(location.pathname);
    });

    // 처음 시작할 때 render를 해야 된다.
    this.render(location.pathname);
  }

  public static getInstance() {
    if (!Router.instance) {
      Router.instance = new Router();
    }

    return Router.instance;
  }

  render(path: string) {
    if(this.routes.has(path)) {
      history.pushState({}, '', window.location.origin + path);
      const routeToPath = this.routes.get(path) as () => string;
      this.$app.innerHTML = routeToPath();
      initRender(this.$app, routeToPath);
    } else {
      history.pushState({}, '', window.location.origin + '/');
      const routeToMain = this.routes.get('/') as () => string;
      initRender(this.$app, routeToMain);
    }
    this.addWholeAnchorEvent();
  }

  addWholeAnchorEvent() {
    const aTags = document.querySelectorAll('a');
    console.log(aTags);
    
    aTags.forEach((tag) => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const path = tag.href.split(':5173')[1];
        // const tagRef = tag.href.replace(`http://localhost:5173${path}`, '');
        this.render(path);
      })
    })
  }
}

export default Router;