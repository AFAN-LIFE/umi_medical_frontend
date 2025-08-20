import {useParams, withRouter} from 'umi';

// 使用withRouter包一个Props，这是React V5的写法
// 那么Props中就有几个属性：history、location、match、navigate、params
const CountPage = (props) => {
  console.log(props)
  return (
    <div>
      <p>计数器</p>
    </div>
  );
};

export default withRouter(CountPage);


// React V6是useParams
// const CountPage = () => {
//   // 基于路由hook获取路径参数
//   let params = useParams();
//   console.log(params)
//   return (
//     <div>
//       <p>计数器</p>
//     </div>
//   );
// };

// export default CountPage;