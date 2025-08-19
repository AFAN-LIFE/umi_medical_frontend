// NavLink: Umi 提供的导航链接组件，类似于 React Router 的 NavLink，会自动处理路由导航和活动状态
// Outlet: Umi 提供的嵌套路由出口组件，用于渲染子路由内容
// styled: 来自 styled-components 库，用于创建带样式的组件
import { NavLink, Outlet } from 'umi';
import styled from 'styled-components';

// 创建了一个名为 StyleLayoutBox 的样式化 div 组件，并定义了该组件的样式
// &.active 选择器之所以有效，是因为 NavLink 在匹配当前路由时会自动添加 active 类名
let StyleLayoutBox = styled.div`
  .nav-box {
    height: 50%;
    border-bottom: 1px solid red;

    a{
      margin-right: 10px;
      color: blue;
      text-decoration: none;

      &.active {
        color: red;
        font-weight: bold;
      }
    }
  }
`;

export default function Layout() {
  return (
    <StyleLayoutBox>
      <div className='nav-box'>
          {/*  NavLink 组件最终会被渲染为 HTML 的 <a> 标签 <a href="/" class="active">首页</a> */}
          <NavLink to='/'>首页</NavLink>
          <NavLink to='/docs'>文档</NavLink>
          <NavLink to='/count'>计数器</NavLink>
          <NavLink to='/user'>用户中心</NavLink>
        <hr />
        <p>这是一个布局组件</p>
      </div>
      <Outlet />
    </StyleLayoutBox>
  );
}
