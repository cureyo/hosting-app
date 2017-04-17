import { HostingAppPage } from './app.po';

describe('hosting-app App', function() {
  let page: HostingAppPage;

  beforeEach(() => {
    page = new HostingAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
