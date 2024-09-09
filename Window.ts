const Stat = PokeRogue.enums.Stat;
const Nature = PokeRogue.data.Nature;
const describePokemon = (pokemon: PokeRogue.field.Pokemon) => {
    ImGui.Text(`Id: ${pokemon.id}`);
    ImGui.Text(`Shiny: ${pokemon.shiny}`);
    ImGui.Text(`Level: ${pokemon.level}`);
    if (pokemon.gender === -1) {
        ImGui.Text(`Gender: genderless`);
    } else {
        ImGui.Text(`Gender: ${pokemon.gender === 0 ? 'Male' : 'Female'}`);
    }
    ImGui.Text(`Health: ${pokemon.hp}`);

    if (ImGui.TreeNode(`stats##${pokemon.id}`)) {
        pokemon.stats.forEach((stat, statindex) => {
            ImGui.Text(`${Stat[statindex]}: ${stat}`);
        });
        ImGui.TreePop();
    }

    if (ImGui.TreeNode(`ivs##${pokemon.id}`)) {
        pokemon.ivs.forEach((iv, ivindex) => {
            ImGui.Text(`${Stat[ivindex]}: ${iv}`);
        });
        ImGui.TreePop();
    }

    if (ImGui.TreeNode(`moveset##${pokemon.id}`)) {
        pokemon.getMoveset().forEach((move) => {
            ImGui.Text(move?.getMove().name);
        });
        ImGui.TreePop();
    }
    ImGui.Text(`passive: ${pokemon.passive}`);
    ImGui.Text(`luck: ${pokemon.luck}`);
    ImGui.Text(`Level: ${pokemon.level}`);

    ImGui.Text(`Nature: ${Nature[pokemon.getNature()]}`);
    if (ImGui.TreeNode(`${pokemon.species.getName()}##species${pokemon.id}`)) {
        ImGui.Text(`generation: ${pokemon.species.generation}`);
        ImGui.Text(`sub-legendary: ${pokemon.species.subLegendary}`);
        ImGui.Text(`legendary: ${pokemon.species.legendary}`);
        ImGui.Text(`mythical: ${pokemon.species.mythical}`);
        ImGui.Text(`growth rate: ${pokemon.species.growthRate}`);
        ImGui.Text(`male: ${pokemon.species.malePercent}%`);
        ImGui.Text(`gender diffs: ${pokemon.species.genderDiffs}`);
        ImGui.Text(`can change form: ${pokemon.species.canChangeForm}`);
        ImGui.Text(`obtainable: ${pokemon.species.isObtainable()}`);

        if (ImGui.TreeNode(`forms##${pokemon.id}`)) {
            pokemon.species.forms.forEach((form) => {
                ImGui.Text(`${form.formName}`);
            });
            ImGui.TreePop();
        }

        if (ImGui.TreeNode(`prevolution levels##${pokemon.id}`)) {
            pokemon.species.getPrevolutionLevels().forEach((ev) => {
                ImGui.Text(`${ev[1]}`);
            });
            ImGui.TreePop();
        }

        if (ImGui.TreeNode(`evolution levels##${pokemon.id}`)) {
            pokemon.species.getEvolutionLevels().forEach((ev) => {
                ImGui.Text(`${ev[1]}`);
            });
            ImGui.TreePop();
        }

        ImGui.TreePop();
    }
};

addWindow(
    'Pokemon describer',
    () => {
        const battleScene = getBattleScene();

        if (!battleScene || typeof battleScene.getParty !== 'function') {
            ImGui.Text('Game is still loading');
            return;
        }
        if (ImGui.CollapsingHeader('Pokemon hover info')) {
            let pokemon = data.getData('examplePokemonHover', undefined, false);
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

            const changed = ImGui.ColorEdit3('Bg Color', data.getData('HoverWindowBackground', new ImGui.ImVec4(0, 0, 0, 1), true));
            if (changed) {
                data.savePersistentData();
            }

            const drawHoverWindow = data.getData('drawHoverWindow', undefined, false);

            if (drawHoverWindow) {
                drawHoverWindow('ExampleHover', pokemon, new ImGui.ImVec2(ImGui.GetWindowPos().x + ImGui.GetWindowWidth(), ImGui.GetWindowPos().y));
            }
        }

        battleScene.getParty().forEach((pokemon) => {
            ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(0, 255, 0, 255));
            if (ImGui.CollapsingHeader(`${pokemon.name}##${pokemon.id}`)) {
                ImGui.PopStyleColor();
                describePokemon(pokemon);
            } else {
                ImGui.PopStyleColor();
            }
        });

        battleScene.getEnemyParty().forEach((pokemon) => {
            ImGui.PushStyleColor(ImGui.ImGuiCol.Text, ImGui.IM_COL32(255, 0, 0, 255));
            if (ImGui.CollapsingHeader(`${pokemon.name}##${pokemon.id}`)) {
                ImGui.PopStyleColor();
                describePokemon(pokemon);
            } else {
                ImGui.PopStyleColor();
            }
        });
    },
    {
        persistentOpen: true,
    }
);
