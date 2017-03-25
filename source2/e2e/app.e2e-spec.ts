import { Source2Page } from './app.po';

describe('source2 App', () => {
  let page: Source2Page;

  beforeEach(() => {
    page = new Source2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
