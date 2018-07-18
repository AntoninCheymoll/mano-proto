module.exports = {
  "extends": "airbnb-base",
  "env": {
    "browser": true,
  },
  "rules": {
    "no-param-reassign": "off",
    "prefer-destructuring": ["error", {
      "array": false,
      "object": true
    }, {
      "enforceForRenamedProperties": false
    }],
  }
};
