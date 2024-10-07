import * as React from 'react';
import renderer from 'react-test-renderer';


it(`renders correctly`, () => {
  const tree = renderer.create(<Text>Snapshot test!</Text>).toJSON();

  expect(tree).toMatchSnapshot();
});
