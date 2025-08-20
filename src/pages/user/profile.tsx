import { withRouter, createSearchParams, useSearchParams, useLocation} from "umi";

// props里面的search参数有参数，但是是字符串的问号拼接
// const ProfilePage = (props) => {

const ProfilePage = ({location}) => {
  console.log(location);

  // 方式1：使用React V6的URLSearchParams来解析问号参数
  // const usp = new URLSearchParams(location.search)
  // console.log(usp.get('name')); // afan
  // console.log(usp.get('age')); // 18  

  // // 方式2：使用Umi的createSearchParams来解析问号参数
  // const usp2 = createSearchParams(location.search)
  // console.log(usp2.get('name')); // afan
  // console.log(usp2.get('age')); // 18 

  // // 方式3：使用React V6的useSearchParams来解析问号参数
  // const [usp] = useSearchParams(); // 返回一个数组，第一个是URLSearchParams对象，第二个是设置参数的函数
  // console.log(usp.get('name')); // afan
  // console.log(usp.get('age')); // 18  

  // 方式4：隐式传参 使用location.state来获取隐式传参
  // const usp = new URLSearchParams(location.state)
  // console.log(usp.get('name')); // afan
  // console.log(usp.get('age')); // 18  

  // 方式5：使用Umi的useLocation来获取location对象
  const loc = useLocation();
  console.log(loc.state); // {name: 'afan', age: 18}  

  return (
    <div>
      <p>我的信息</p>
    </div>
  );
};

export default withRouter(ProfilePage);
