import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="pt-20 overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
