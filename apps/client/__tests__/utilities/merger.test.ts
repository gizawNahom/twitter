import { EndOfListError, merger1 } from '../../utilities/client';

function executeSUT(
  existing: { __ref: string }[] | undefined,
  incoming: { __ref: string }[] | { __ref: string }[]
) {
  return merger1(existing, incoming);
}

test.each([
  [undefined, [{ __ref: '1' }], [{ __ref: '1' }]],
  [undefined, [], []],
  [[], [], []],
  [[{ __ref: '1' }], [{ __ref: '2' }], [{ __ref: '1' }, { __ref: '2' }]],
  [
    [{ __ref: '1' }],
    [{ __ref: '1' }, { __ref: '2' }],
    [{ __ref: '1' }, { __ref: '2' }],
  ],
])(
  `existing:  %s incoming: %s expected: %s`,
  async (existing, incoming, expected) => {
    const merged = executeSUT(existing, incoming);
    expect(merged).toStrictEqual(expected);
  }
);

test('throws if the end of the page is reached', () => {
  expect(() => executeSUT([{ __ref: '1' }], [])).toThrow(new EndOfListError());
});
