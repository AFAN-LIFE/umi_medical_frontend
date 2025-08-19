// 当路由加载时匹配到的组件，加载非常慢时，可以先显示一个Loading效果

export default function Loading() {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Loading...</h1>
        <p>Please wait while we load the content.</p>
        </div>
    );
}