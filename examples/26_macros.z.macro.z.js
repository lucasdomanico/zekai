export let macro = (_) => (s, i) => {
    let kitty = _.combo(_.token('%kitty%'), (ast) => {
        return _.ast('string', "'hello kitty n!'", [], ast.pos, ast.length, ast.error);
    });
    return kitty(s, i);
};
