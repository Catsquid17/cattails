<!DOCTYPE php>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Catsquid's Stuff</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous" />
    <link href="css/styles.css" rel="stylesheet" />
  </head>

  <body>
    <div class="content-wrapper">
      <?php include('header.php'); ?>
      <main>
        <div class="row mb-3">
          <div class="col-md-8">
            <h1>Welcome</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sollicitudin sapien eu libero euismod, sit amet tempor risus tincidunt. Donec et tincidunt massa. Suspendisse ipsum dolor, volutpat eget hendrerit et, porta ac arcu.
              Nullam imperdiet consectetur congue. Phasellus auctor gravida risus at aliquam. Sed pharetra urna at elit convallis, ut sodales dui finibus. Fusce vitae sem neque. Praesent pulvinar diam sit amet dui posuere, id consequat elit
              efficitur. Nulla dui nibh, tristique nec augue quis, sagittis vulputate erat. Duis pulvinar nibh nibh. Nullam facilisis eros ac turpis eleifend, ut pharetra ex finibus. Pellentesque pharetra, sapien elementum posuere imperdiet, odio
              purus semper magna, quis facilisis tellus libero sit amet massa. Curabitur at maximus felis. Ut non massa sit amet odio tristique malesuada ac ac massa. Suspendisse posuere massa ac pellentesque pulvinar. Sed in euismod massa, sit amet
              malesuada massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean auctor lobortis iaculis. Ut velit urna, sagittis nec rutrum non, finibus porttitor ipsum. Pellentesque arcu orci, cursus
              quis imperdiet at, euismod at tellus. Aliquam bibendum sed sem in aliquet. Vestibulum sed magna mauris. Curabitur iaculis a metus in vehicula. Nullam gravida viverra nisl, at scelerisque arcu tristique in. Nullam nisi mauris, imperdiet
              lobortis nisi dignissim, euismod posuere orci. Cras tincidunt elit ac velit consectetur, fringilla tristique urna tincidunt. Aliquam eget lacus est.
            </p>
          </div>

          <div class="list-group col-md-4">
            <h2>Recent Mods</h2>
            <a href="./mod-pages/mod.php" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true" id="first-recent-mod">
              <img src="https://github.com/twbs.png" alt="" width="64" height="64" class="rounded flex-shrink-0" />
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Recent Mod</h6>
                  <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
                </div>
                <small class="opacity-50 text-nowrap">Jul 2025</small>
              </div>
            </a>
            <a href="./mod-pages/mod.php" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
              <img src="https://github.com/twbs.png" alt="" width="64" height="64" class="rounded flex-shrink-0" />
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Recent Mod</h6>
                  <p class="mb-0 opacity-75">Some placeholder content in a paragraph that goes a little longer so it wraps to a new line.</p>
                </div>
                <small class="opacity-50 text-nowrap">Jun 2025</small>
              </div>
            </a>
            <a href="./mod-pages/mod.php" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
              <img src="https://github.com/twbs.png" alt="" width="64" height="64" class="rounded flex-shrink-0" />
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Recent Mod</h6>
                  <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
                </div>
                <small class="opacity-50 text-nowrap">Mar 2025</small>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
    <?php include('footer.php'); ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossorigin="anonymous"></script>
  </body>
</html>
