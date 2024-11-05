module.exports = {
  '**/*.(ts|tsx|js|md)': (filenames) => [`prettier --write ${filenames.join(' ')}`],
};
