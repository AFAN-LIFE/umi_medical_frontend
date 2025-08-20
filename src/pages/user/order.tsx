import { useNavigate, Navigate } from "umi";
import { Button } from "antd";


const OrderPage = () => {
  // 使用useNavigate获取navigate函数
  const navigate = useNavigate();
  const fn = () => {
    // console.log("fn...");

    // 方式1 直接跳转到个人信息页面
    // navigate('/user/profile'); 


    // 方式2 使用对象形式跳转，并通过问号传参
    // navigate({
    //   pathname: '/user/profile',
    //   search: '?name=afan&age=18',
    // })

    // 方式3 使用Navigate组件跳转，并通过隐式传参
    // ！！！隐式传参的参数，在地址上看不到，且刷新不会丢失！！！
    navigate('/user/profile',{
      state: {name: 'afan', age: 18}  // 通过state传参，刷新就没了
    })
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
