import { NavLink, Outlet } from 'umi';
import styled from 'styled-components';

let StyleUserBox = styled.div`
  display: flex;
  .menu {
    display: flex;
    flex-direction: column;
    margin-right: 20px;

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

const UserPage = () => {
  return (
    <StyleUserBox>
      <div className='menu'>
          <NavLink to='/user/order'>订单管理</NavLink>
          <NavLink to='/user/profile'>个人信息</NavLink>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </StyleUserBox>
  );
}

export default UserPage;
