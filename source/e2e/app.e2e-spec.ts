import { SourcePage } from './app.po';

describe('source App', function() {
  let page: SourcePage;

  beforeEach(() => {
    page = new SourcePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
