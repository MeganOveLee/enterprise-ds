// Enterprise DS — Figma 변수 내보내기 (DS-ADR-045)
// Foundation 파일에서 실행 → 모든 로컬 변수 컬렉션 · 모드 · 값을 JSON 한 파일로 받는다.
// 변수를 읽기만 하고 고치지 않는다(두 번 돌려도 결과가 같음). 받은 파일은 저장소 tokens/figma/export.json 에 넣고
// npm run tokens:figma 로 tokens/build/resolved.json 과 대조한다.
figma.showUI(__html__, { width: 360, height: 200 });

function color(c) {
  const h = v => Math.round(v * 255).toString(16).padStart(2, '0').toUpperCase();
  return { hex: '#' + h(c.r) + h(c.g) + h(c.b), alpha: c.a === undefined ? 1 : Math.round(c.a * 1000) / 1000 };
}

async function exportAll() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();
  const byId = Object.fromEntries(variables.map(v => [v.id, v]));
  const colName = Object.fromEntries(collections.map(c => [c.id, c.name]));
  const out = {
    file: figma.root.name,
    exportedAt: new Date().toISOString(),
    collections: collections.map(c => ({
      name: c.name,
      modes: c.modes.map(m => m.name),
      variables: c.variableIds.map(id => byId[id]).filter(Boolean).map(v => ({
        name: v.name,
        type: v.resolvedType,
        web: v.codeSyntax && v.codeSyntax.WEB ? v.codeSyntax.WEB : null,
        values: Object.fromEntries(c.modes.map(m => {
          const val = v.valuesByMode[m.modeId];
          if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
            const t = byId[val.id];
            return [m.name, { alias: t ? colName[t.variableCollectionId] + '/' + t.name : val.id }];
          }
          if (v.resolvedType === 'COLOR') return [m.name, color(val)];
          return [m.name, val];
        })),
      })),
    })),
  };
  const count = out.collections.reduce((n, c) => n + c.variables.length, 0);
  figma.ui.postMessage({ type: 'done', json: JSON.stringify(out, null, 2), count, collections: collections.length });
}

figma.ui.onmessage = msg => { if (msg.type === 'export') exportAll(); };
