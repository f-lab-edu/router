import Header from '../components/Header';

const MyPage = () => {
  return `
    ${Header()}
    <div>
      <h3>My Page입니다.</h3>
      <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint cupiditate aliquam beatae ducimus, ex fugit debitis eos et delectus provident dolores deleniti aut nesciunt voluptates cumque ipsum quam voluptatibus? Itaque?</div>
    </div>
  `
}

export default MyPage;