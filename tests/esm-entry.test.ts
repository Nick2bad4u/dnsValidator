describe('ESM build entry', () => {
  test('dynamic import root', async () => {
    const mod = await import('../dist/esm/index.js');
    expect(typeof mod.validateDNSRecord).toBe('function');
  });
  test('dynamic import subpath', async () => {
    const mod = await import('../dist/esm/validators.js');
    expect(typeof mod.validateARecord).toBe('function');
  });
});
