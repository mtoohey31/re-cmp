{ autoconf, automake, emscripten, emscriptenStdenv, fetchurl }:

(emscriptenStdenv.mkDerivation rec {
  pname = "pcre-wasm";
  version = "8.45";

  src = fetchurl {
    url = "mirror://sourceforge/project/pcre/pcre/${version}/pcre-${version}.tar.bz2";
    sha256 = "sha256-Ta5v3NK7C7bDe1+Xwzwr6VTadDmFNpzdrDVG4yGL/7g=";
  };

  buildInputs = [ ];
  nativeBuildInputs = [ autoconf automake ];

  configurePhase = ''
    export HOME="$TMPDIR"
    export EM_CACHE="$TMPDIR/em-cache"
    cp -r ${emscripten}/share/emscripten/cache "$EM_CACHE"
    chmod -R +w "$EM_CACHE"

    runHook preConfigure

    emconfigure ./configure --prefix=$out --disable-jit --disable-shared

    runHook postConfigure
  '';

  buildPhase = ''
    runHook preBuild

    emmake make -j$NIX_BUILD_CORES

    runHook postBuild
  '';
}).overrideAttrs (_: { doCheck = false; })
