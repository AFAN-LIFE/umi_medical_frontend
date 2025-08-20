import { useNavigate, Navigate, history} from "umi";
import { Button } from "antd";


const OrderPage = () => {
  // 使用useNavigate获取navigate函数
  const fn = () => {
    // 方式1 直接跳转到个人信息页面
    // navigate('/user/profile');   

    // 方式2 问号传参，获取这个参数需要在个人信息页面使用useSearchParams或者location.state来获取，同navigate就不演示了
    // history.push({
    //   pathname: '/user/profile',
    //   search: '?name=afan&age=18',
    // });

    // 方式3 query传参，没什么特别的
    // 在config/config.ts中配置historyWithQuery: {}，开启配置
    // history.push({
    //   pathname: '/user/profile',
    //   query: {
    //     name: 'afan',
    //     age: 18,
    //   }
    // });

    // 方式4 隐式传参，不需要写state了，获取方式参考navigate的隐式传参获取方式
    // React V6中隐式传参目标刷新后不会丢失，V5中会丢失
    history.push('/user/profile', {
      name: 'afan', age: 18
    });
  }
  return (
    <div>
      <p>我的订单</p>
      <Button type="primary" onClick={() => {
        fn()
      }}> 查看个人信息
      </Button>
    </div>
  );
};

export default OrderPage;
