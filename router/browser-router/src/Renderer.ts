const Renderer = () => {
  let root: any;
  let component: any;

  const initRender = (initialRoot: HTMLElement, initialComponent: () => string) => {
    root = initialRoot;
    component = initialComponent;
    render();
  }

  const render = () => (root.innerHTML = component());

  return { initRender, render };
}

export const { initRender, render } = Renderer();