// src/App.tsx
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { Auth } from './apps/Auth/Auth';

export default function App() {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <Auth/>
    </RecoilRoot>
  );
}
