// 当路由加载时匹配到的组件，加载非常慢时，可以先显示一个Loading效果

import {Spin} from "antd"
import styled from "styled-components"

const StyleLoadingBox = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
    .ant-spin {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;
export default () => {
    return <StyleLoadingBox>
        <Spin size="large"></Spin>
        {/* 加载中... */}   
    </StyleLoadingBox>
}