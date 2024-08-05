import { EndOfListError, merger } from '../../utilities/client';

test.each([
  [undefined, [{ id: '1' }], [{ id: '1' }]],
  [[{ id: '1' }], [{ id: '2' }], [{ id: '1' }, { id: '2' }]],
  [[{ id: '1' }], [{ id: '1' }, { id: '2' }], [{ id: '1' }, { id: '2' }]],
])(
  `existing:  %s incoming: %s expected: %s`,
  async (existing, incoming, expected) => {
    const merged = merger(existing, incoming);
    expect(merged).toStrictEqual(expected);
  }
);

test('throws if the end of the page is reached', () => {
  expect(() => merger(undefined, [])).toThrow(new EndOfListError());
  expect(() => merger([{ id: '1' }], [])).toThrow(new EndOfListError());
});
