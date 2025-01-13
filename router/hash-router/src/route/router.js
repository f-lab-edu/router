/**
 * 리우터 구현하기
 * Fragment 해시 & pages 함수를 연결해주는 라우터의 기능 구현하기
 * 
 * routes: 애플리케이션 경로 목록을 수집하는 레지스트리, URL을 구성 요소에 매핑한 객체들을 저장하는 배열
 * router: 라우터를 구현한 객체로, 기능들을 메서드로 추상화
 * addRoute: routes 배열에 URL과 구성요소들을 매핑하여 저장하기 위한 메서드
 * start: URL 변경을 청취하는 메서드
 */
const createRouter = () => {
  // 애플리케이션의 경로 목록들을 담을 배열, 클로저를 이용해 데이터를 추가한다.
  const routes = [];

  // path parameters 식별을 위해 정규표현식 추가
  const ROUTE_PARAMETER_REGEXP = /:(\w+)/g; // :name, :detailName 등 path parameters를 매칭하기 위한 정규표현식
  const URL_REGEXP = '([^\\/]+)';

  // 라우터
  const router = {
    // 라우터 기능 1) 애플리케이션의 경로 목록들을 저장한다.
    addRoute(fragment, component) {
      const params = [];
      const parsedFragment = fragment.replace(ROUTE_PARAMETER_REGEXP, (_, paramName) => {
        params.push(paramName); // path parameter 이름을 추출하여 배열에 넣어줌 ["name", "detailName"]
        return URL_REGEXP; // path parameter에 매치되는 문자를 URL_REGEXP로 치환
      }).replace(/\//g, "\\/"); // "/"의 텍스트로써 사용을 위해 모든 "/" 앞에 이스케이프 문자("\")를 추가
      // fragment는 replace 함수를 통해 parsedFragment로 치환된다. 
      /**
       * fragment                     parsedFragment
       * #/                           #\/$
       * #/beverage                   #\/beverage$
       * #/beverage/:name/:detailName      #\/beverage\/([^\\/]+)\/([^\\/]+)$
       */
      routes.push({
        fragmentRegExp: new RegExp(`^${parsedFragment}$`),
        component,
        params
      });
      return this;
    },

    // 라우터 기능 2) 현재 URL이 변경되면 페이지 콘텐츠를 해당 URL에 매핑된 구성 요소로 교체한다.
    start() {
      // path parameter 데이터 (Coffee, americano)를 가져오는 코드 추가
      const getUrlParams = (route, hash) => {
        const params = {};
        const matches = hash.match(route.fragmentRegExp);

        matches.shift(); // 배열의 첫 번째 값에는 url 전체가 담겨있으므로 제거
        matches.forEach((paramValue, idx) => {
          const paramName = route.params[idx];
          params[paramName] = paramValue;
        })

        // params = {name: "Coffee", detailName: "americano"}
        return params;
      };

      // routes 배열에서 현재 브라우저 hash 값과 동일한 해시값을 가진 구성 요소를 찾는다.
      const checkRoutes = () => {
        // const currentRoute = routes.find(route => route.fragment === window.location.hash);
        const currentRoute = routes.find(route => route.fragmentRegExp.test(window.location.hash));
        if(!currentRoute) {
          window.location.hash = '#/';
          return;
        }
        if(currentRoute.params.length) {
          const urlParams = getUrlParams(currentRoute, window.location.hash);
          currentRoute.component(urlParams);
        } else {
          currentRoute.component(); // 페이지 이동을 보여주기 위해 innerText를 변경하는 메서드
        }
      };

      window.addEventListener('hashchange', checkRoutes); // 브라우저에서 hash 값이 바뀔 때 발생하는 이벤트
      checkRoutes();
    },
    
    // 전달받은 Fragment해시로 URL 해시값을 바꿔주는 라우터 메서드 
    navigate(fragment/* , replace = false */) {
      /** location replace 옵션 추가 - 페이지 이동이 일어나도 히스토리가 쌓이지 않아 브라우저 뒤로가기가 비활성화 됨 */
      window.location.hash = fragment;
      /* if (replace) {
        const href = window.location.href.replace(window.location.hash, "#" + fragment);
        window.location.replace(href);
      } else {
        window.location.hash = fragment;
      } */
    }
  };

  return router;
}

export default createRouter;