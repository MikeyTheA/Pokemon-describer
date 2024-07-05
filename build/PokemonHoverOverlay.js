var IO = ImGui.GetIO();
window['update'] = function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined || battleScene.getEnemyParty === undefined) {
        return;
    }
    var canvasSize = getGameCanvasSize();
    battleScene
        .getEnemyParty()
        .concat(battleScene.getParty())
        .forEach(function (pokemon) {
        if (pokemon.visible) {
            var matrix = pokemon.getWorldTransformMatrix().matrix;
            var sprite = pokemon.getSprite();
            var spriteX = matrix[4] / pokemon.scene.cameras.main.scaleManager.displayScale.x + canvasSize[0];
            var spriteY = matrix[5] / pokemon.scene.cameras.main.scaleManager.displayScale.y + canvasSize[1];
            if (IO.MousePos.x > spriteX + sprite.getTopLeft().x * 6 && IO.MousePos.x < spriteX + sprite.width * 3 && IO.MousePos.y > spriteY + sprite.getTopLeft().y * 6 && IO.MousePos.y < spriteY) {
                drawHoverWindow("HoverWindowDescriber".concat(pokemon.id), pokemon, data.getData('HoverWindowCursor', false, true) ? undefined : new ImGui.ImVec2(spriteX - sprite.width * 3, spriteY));
            }
        }
    });
};
var drawHoverWindow = function (windowname, pokemon, pos) {
    if (pos === void 0) { pos = undefined; }
    var battleScene = getBattleScene();
    if (battleScene === undefined || battleScene.getEnemyParty === undefined) {
        return;
    }
    var flags = ImGui.WindowFlags.AlwaysAutoResize + ImGui.WindowFlags.NoTitleBar + ImGui.WindowFlags.NoInputs + ImGui.WindowFlags.NoScrollbar + ImGui.WindowFlags.NoCollapse + ImGui.WindowFlags.NoSavedSettings + ImGui.WindowFlags.NoResize + ImGui.WindowFlags.NoMove + ImGui.WindowFlags.NoInputs + ImGui.WindowFlags.NoNav + ImGui.WindowFlags.MenuBar + ImGui.WindowFlags.NoFocusOnAppearing;
    if (data.getData('PokemonHover', false, true)) {
        if (pos === undefined) {
            ImGui.SetNextWindowPos(new ImGui.ImVec2(IO.MousePos.x + 20, IO.MousePos.y + 20));
        }
        else {
            ImGui.SetNextWindowPos(pos);
        }
        var bgColor = data.getData('HoverWindowBackground', new ImGui.Vec4(0, 0, 0, 1), true);
        var opacity = data.getData('HoverWindowAlpha', 1, true);
        ImGui.PushStyleVar(ImGui.StyleVar.WindowPadding, new ImGui.Vec2(1, 1));
        ImGui.PushStyleColor(ImGui.Col.WindowBg, bgColor);
        ImGui.SetNextWindowBgAlpha(opacity);
        ImGui.SetNextWindowSize(new ImGui.ImVec2(0, 0), ImGui.Cond.Appearing);
        ImGui.Begin(windowname, undefined, flags);
        var textColor = ensureTextVisibility([bgColor.x * 255, bgColor.y * 255, bgColor.z * 255]);
        var textColorVec4_1 = new ImGui.ImVec4(textColor[0] / 255, textColor[1] / 255, textColor[2] / 255, textColor[3]);
        try {
            ImGui.TextColored(textColorVec4_1, "".concat(pokemon.name, " Lv.").concat(pokemon.level));
            ImGui.SameLine();
            ImGui.TextColored(textColorVec4_1, "".concat(pokemon.hp, "/").concat(pokemon.getMaxHp()));
            var nature = PokeRogue.data.Nature[pokemon.nature];
            ImGui.TextColored(textColorVec4_1, "".concat(nature.charAt(0)).concat(nature.slice(1).toLowerCase(), " ").concat(PokeRogue.data.Gender[pokemon.gender].toLowerCase()));
            var speciesForm = !pokemon.fusionSpecies ? pokemon.getSpeciesForm() : pokemon.getFusionSpeciesForm();
            if (speciesForm.abilityHidden && (pokemon.fusionSpecies ? pokemon.fusionAbilityIndex : pokemon.abilityIndex) === speciesForm.getAbilityCount() - 1) {
                var hue = data.getData("hue".concat(pokemon.id), 0.0, false);
                if (hue >= 0.99) {
                    hue = 0.0;
                }
                data.setData("hue".concat(pokemon.id), hue + 0.0075, false);
                var bgLuminance = 0.299 * bgColor.x + 0.587 * bgColor.y + 0.114 * bgColor.z;
                var saturation = 1.0;
                var value = 1.0;
                if (bgLuminance > 0.5) {
                    saturation = Math.max(0.6, 1.0 - (bgLuminance - 0.5) * 2);
                    value = Math.max(0.7, 1.0 - (bgLuminance - 0.5) * 2);
                }
                else {
                    value = Math.min(1.0, 1.0 - (bgLuminance - 0.5) * 2);
                }
                var rgb = hsvToRgb(hue, saturation, value);
                ImGui.SameLine();
                ImGui.Text('|');
                ImGui.SameLine();
                ImGui.TextColored(rgb, "Hidden ability ".concat(PokeRogue.enums.Abilities[pokemon.species.abilityHidden]));
            }
            ImGui.TextColored(textColorVec4_1, 'stats:');
            pokemon.stats.forEach(function (stat, index) {
                ImGui.SameLine();
                ImGui.TextColored(textColorVec4_1, "".concat(PokeRogue.data.Stat[index], " ").concat(stat));
            });
            ImGui.TextColored(textColorVec4_1, 'ivs:');
            pokemon.ivs.forEach(function (iv, index) {
                ImGui.SameLine();
                ImGui.TextColored(textColorVec4_1, "".concat(PokeRogue.data.Stat[index], " ").concat(iv));
            });
            ImGui.TextColored(textColorVec4_1, 'moves:');
            pokemon.moveset.forEach(function (move, index) {
                ImGui.SameLine();
                ImGui.TextColored(textColorVec4_1, move.getName());
                if (index + 1 !== pokemon.moveset.length) {
                    ImGui.SameLine();
                    ImGui.TextColored(textColorVec4_1, '|');
                }
            });
            var ability = pokemon.getAbility();
            if (ability) {
                ImGui.TextColored(textColorVec4_1, "ability: ".concat(ability.name, " |"));
            }
            ImGui.SameLine();
            var passiveAbility = pokemon.getPassiveAbility();
            if (passiveAbility) {
                ImGui.TextColored(textColorVec4_1, "passive: ".concat(passiveAbility.name));
            }
        }
        catch (e) { }
        ImGui.End();
        ImGui.PopStyleColor();
        ImGui.PopStyleVar();
    }
};
data.setData('drawHoverWindow', drawHoverWindow, false);
function hsvToRgb(h, s, v) {
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var r, g, b;
    switch (i % 6) {
        case 0:
            (r = v), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = v), (b = p);
            break;
        case 2:
            (r = p), (g = v), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = v);
            break;
        case 4:
            (r = t), (g = p), (b = v);
            break;
        case 5:
            (r = v), (g = p), (b = q);
            break;
    }
    return new ImGui.ImVec4(r, g, b, 1.0);
}
function getLuminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function getContrast(rgb1, rgb2) {
    var lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    var lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}
function ensureTextVisibility(bgColor) {
    var whiteContrast = getContrast(bgColor, [255, 255, 255]);
    var blackContrast = getContrast(bgColor, [0, 0, 0]);
    return whiteContrast > blackContrast ? [255, 255, 255, 1.0] : [0, 0, 0, 1.0];
}
