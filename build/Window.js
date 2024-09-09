var Stat = PokeRogue.enums.Stat;
var Nature = PokeRogue.data.Nature;
var describePokemon = function (pokemon) {
    ImGui.Text("Id: ".concat(pokemon.id));
    ImGui.Text("Shiny: ".concat(pokemon.shiny));
    ImGui.Text("Level: ".concat(pokemon.level));
    if (pokemon.gender === -1) {
        ImGui.Text("Gender: genderless");
    }
    else {
        ImGui.Text("Gender: ".concat(pokemon.gender === 0 ? 'Male' : 'Female'));
    }
    ImGui.Text("Health: ".concat(pokemon.hp));
    if (ImGui.TreeNode("stats##".concat(pokemon.id))) {
        pokemon.stats.forEach(function (stat, statindex) {
            ImGui.Text("".concat(Stat[statindex], ": ").concat(stat));
        });
        ImGui.TreePop();
    }
    if (ImGui.TreeNode("ivs##".concat(pokemon.id))) {
        pokemon.ivs.forEach(function (iv, ivindex) {
            ImGui.Text("".concat(Stat[ivindex], ": ").concat(iv));
        });
        ImGui.TreePop();
    }
    if (ImGui.TreeNode("moveset##".concat(pokemon.id))) {
        pokemon.getMoveset().forEach(function (move) {
            ImGui.Text(move === null || move === void 0 ? void 0 : move.getMove().name);
        });
        ImGui.TreePop();
    }
    ImGui.Text("passive: ".concat(pokemon.passive));
    ImGui.Text("luck: ".concat(pokemon.luck));
    ImGui.Text("Level: ".concat(pokemon.level));
    ImGui.Text("Nature: ".concat(Nature[pokemon.getNature()]));
    if (ImGui.TreeNode("".concat(pokemon.species.getName(), "##species").concat(pokemon.id))) {
        ImGui.Text("generation: ".concat(pokemon.species.generation));
        ImGui.Text("sub-legendary: ".concat(pokemon.species.subLegendary));
        ImGui.Text("legendary: ".concat(pokemon.species.legendary));
        ImGui.Text("mythical: ".concat(pokemon.species.mythical));
        ImGui.Text("growth rate: ".concat(pokemon.species.growthRate));
        ImGui.Text("male: ".concat(pokemon.species.malePercent, "%"));
        ImGui.Text("gender diffs: ".concat(pokemon.species.genderDiffs));
        ImGui.Text("can change form: ".concat(pokemon.species.canChangeForm));
        ImGui.Text("obtainable: ".concat(pokemon.species.isObtainable()));
        if (ImGui.TreeNode("forms##".concat(pokemon.id))) {
            pokemon.species.forms.forEach(function (form) {
                ImGui.Text("".concat(form.formName));
            });
            ImGui.TreePop();
        }
        if (ImGui.TreeNode("prevolution levels##".concat(pokemon.id))) {
            pokemon.species.getPrevolutionLevels().forEach(function (ev) {
                ImGui.Text("".concat(ev[1]));
            });
            ImGui.TreePop();
        }
        if (ImGui.TreeNode("evolution levels##".concat(pokemon.id))) {
            pokemon.species.getEvolutionLevels().forEach(function (ev) {
                ImGui.Text("".concat(ev[1]));
            });
            ImGui.TreePop();
        }
        ImGui.TreePop();
    }
};
addWindow('Pokemon describer', function () {
    var battleScene = getBattleScene();
    if (!battleScene || typeof battleScene.getParty !== 'function') {
        ImGui.Text('Game is still loading');
        return;
    }
    if (ImGui.CollapsingHeader('Pokemon hover info')) {
        var pokemon = data.getData('examplePokemonHover', undefined, false);
        if (pokemon === undefined) {
            pokemon = battleScene.addEnemyPokemon(battleScene.randomSpecies(1, 1), 1, 0, false);
            data.setData('examplePokemonHover', pokemon, false);
        }
        ImGui.Checkbox('Enabled', data.getAccess('PokemonHover', false, true));
        ImGui.SameLine();
        if (ImGui.Button('Reroll pokemon')) {
            pokemon = battleScene.addEnemyPokemon(battleScene.randomSpecies(1, 1), 1, 0, false);
            data.setData('examplePokemonHover', pokemon, false);
        }
        ImGui.Checkbox('Glue to cursor', data.getAccess('HoverWindowCursor', false, true));
        ImGui.SliderFloat('Opacity', data.getAccess('HoverWindowAlpha', 1, true), 0, 1);
        var changed = ImGui.ColorEdit3('Bg Color', data.getData('HoverWindowBackground', new ImGui.ImVec4(0, 0, 0, 1), true));
        if (changed) {
            data.savePersistentData();
        }
        var drawHoverWindow = data.getData('drawHoverWindow', undefined, false);
        if (drawHoverWindow) {
            drawHoverWindow('ExampleHover', pokemon, new ImGui.ImVec2(ImGui.GetWindowPos().x + ImGui.GetWindowWidth(), ImGui.GetWindowPos().y));
        }
    }
    battleScene.getParty().forEach(function (pokemon) {
        ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(0, 255, 0, 255));
        if (ImGui.CollapsingHeader("".concat(pokemon.name, "##").concat(pokemon.id))) {
            ImGui.PopStyleColor();
            describePokemon(pokemon);
        }
        else {
            ImGui.PopStyleColor();
        }
    });
    battleScene.getEnemyParty().forEach(function (pokemon) {
        ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(255, 0, 0, 255));
        if (ImGui.CollapsingHeader("".concat(pokemon.name, "##").concat(pokemon.id))) {
            ImGui.PopStyleColor();
            describePokemon(pokemon);
        }
        else {
            ImGui.PopStyleColor();
        }
    });
}, {
    persistentOpen: true,
});
