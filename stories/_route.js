// 경로 요약 견본 조각 (TD-172) — Blocks/Route Summary · Navigation/App Bar 가 함께 씀. 모양은 css/blocks/mobility.css
export const stop = (kind, label, place, time = '') => '<li class="route-summary__stop route-summary__stop--' + kind + '"><span class="route-summary__mark" aria-hidden="true"></span><span class="route-summary__label">' + label + '</span>' + place + '<span class="route-summary__time">' + time + '</span></li>';
export const name = (t) => '<span class="route-summary__place">' + t + '</span>';
export const route = (vias) => '<ol class="route-summary" aria-label="이동 경로">' + stop('start', '출발', name('이천종합터미널'), '오전 9:12') +
  (vias.length === 1 ? stop('via', '경유', name(vias[0]), '오전 9:20') : vias.length > 1 ? stop('via', '경유', '<details class="route-summary__vias"><summary>' + vias[0] + ' 외 ' + (vias.length - 1) + '곳</summary>' + vias.map(name).join('') + '</details>', '') : '') +
  stop('end', '도착', name('이천의료원 장례식장 앞 정류장'), '오전 9:41') + '</ol>';
