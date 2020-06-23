import Link from 'next/link'
import Layout from '../components/Layout';

const Index = () => (
    <Layout>
        <h1>
            안녕, Next.js
        </h1>
        <h2>
            <Link href="/about">
                <a style={{background: 'black', color: 'white'}}>소개</a>
            </Link>
        </h2>
    </Layout>
);

export default Index;