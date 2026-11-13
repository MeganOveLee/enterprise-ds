// Blocks/Route Summary: 문서 화면은 RouteSummary.mdx. 모바일 앱 전용 조합 (css/blocks/mobility.css)
import { phone, body } from './_mobile.js';
import { route } from './_route.js';

export default {
  title: 'Blocks/Route Summary',
  tags: ['!dev', '!autodocs', 'device-mobile'],   // 쓰는 기기 = 모바일 앱 (DS-ADR-055)
  parameters: { docs: { source: { language: 'html' } } },
};

export const 경유_하나 = { render: () => phone(body(route(['관고전통시장']))) };
export const 경유_둘_이상 = { render: () => phone(body(route(['관고전통시장', '설봉공원']))) };
