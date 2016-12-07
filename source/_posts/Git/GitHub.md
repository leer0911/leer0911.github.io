---
title: GitHub
---

## 初始设置
[GitHub下载地址](https://git-for-windows.github.io/)

  * ### 设置姓名和邮箱地址
  首先来设置使用 Git 时的姓名和邮箱地址。名字请用英文输入。
  ```bash
    $ git config --global user.name "Firstname Lastname"
    $ git config --global user.email "your_email@example.com"
  ```
  这个命令，会在“ ~/.gitconfig”中以如下形式输出设置文件。

  * ### 提高命令输出的可读性
  顺便一提，将 color.ui 设置为 auto 可以让命令的输出拥有更高的可 读性。
  ```bash
    $ git config --global color.ui auto
  ```

## 使用前的准备
  [GitHub](https://github.com/join)

  * ### 设置 SSH Key
  GitHub 上连接已有仓库时的认证，是通过使用了 SSH 的公开密钥 认证方式进行的。现在让我们来创建公开密钥认证所需的 SSH Key，并 将其添加至 GitHub。
  ```bash
    $ ssh-keygen -t rsa -C "创建账户时用的邮 箱地址"
    # 提示信息
    Generating public/private rsa key pair.
    Enter file in which to save the key
    (/Users/your_user_directory/.ssh/id_rsa): 按回车键
    Enter passphrase (empty for no passphrase): 输入密码
    Enter same passphrase again: 再次输入密码
  ```
  输入密码后会出现以下结果。
  ```bash
    Your identification has been saved in /Users/your_user_directory/.ssh/id_rsa.
    Your public key has been saved in /Users/your_user_directory/.ssh/id_rsa.pub.
    The key fingerprint is:
    fingerprint值 your_email@example.com
    The key\`s randomart image is:
    +--[ RSA 2048]----+
    | .+ + |
    | = o O . |
    略
  ```

  id_rsa 文件是私有密钥， id_rsa.pub 是公开密钥。

  * ### 添加公开密钥
  在 GitHub 中添加公开密钥，今后就可以用私有密钥进行认证了。 点击右上角的账户设定按钮（Account Settings），选择 SSH Keys 菜 单。点击 Add SSH Key 之后，在 Title 中输入 适当的密钥名称。 Key 部分请粘贴 id_rsa.pub 文件里的内容。 id_rsa.pub 的内容可以用如下方法查看。
  ```bash
    $ cat ~/.ssh/id_rsa.pub
    ssh-rsa 公开密钥的内容 your_email@example.com
  ```
  完成以上设置后，就可以用手中的私人密钥与 GitHub 进行认证和 通信了。让我们来实际试一试。
  ```bash
    $ ssh -T git@github.com
    The authenticity of host \'github.com (207.97.227.239)\' can\'t be established.
    RSA key fingerprint is fingerprint值 .
    Are you sure you want to continue connecting (yes/no)? 输入y
  ```
  出现如下结果即为成功。
  ```bash
    Hi hirocastest! You\'ve successfully authenticated, but GitHub does not
    provide shell access.
  ```

  * ### 使用社区功能
  在创建账户后不妨试试 Follow（关注）别人。这样一来，您所 Follow 的用户的活动就会显示在您的控制面板页面 中。您可以通过这种方法知道那个人在 GitHub 上都做了些什么。对于仓库，也可以使用 Watch 功能获取最新的开发信息。如果您经 常使用的某个软件正在 GitHub 上进行开发，不妨去 Watch 一下。

  * ### 实际动手使用
  ```bash
    # 克隆项目到本地
    $ git clone

    # $ git status
    # On branch master
    # Untracked files:
    # (use "git add <file>..." to include in what will be committed)
    #
    # hello_world.php
    # nothing added to commit but untracked files present (use "git add" to track)

    # 通过 git add命令将文件加入暂存区
    $ git add hello_world.php

    # 提交
    $ git commit -m "Add hello world script by php"

    # 查看提交命令
    git log

    # 之后只要执行 push， GitHub 上的仓库就会被更新
    $ git push
  ```

## 基本操作

  * ### git init——初始化仓库
  要使用 Git 进行版本管理，必须先初始化仓库。 Git 是使用 git init命令进行初始化的。请实际建立一个目录并初始化仓库。
  ```bash
    $ mkdir git-tutorial
    $ cd git-tutorial
    $ git init
    Initialized empty Git repository in /Users/hirocaster/github/github-book
    /git-tutorial/.git/
  ```
  果初始化成功，执行了 git init命令的目录下就会生成 .git 目 录。这个 .git 目录里存储着管理当前目录内容所需的仓库数据。

  * ### git status——查看仓库的状态
  ```bash
    $ git status
    # On branch master
    #
    # Initial commit
    #
    nothing to commit (create/copy files and use "git add" to track)
  ```

  * ### git add——向暂存区中添加文件
  暂存区是提交之前的一个临时区域
  ```bash
    $ git add README.md
    $ git status
    # On branch master
    # Initial commit
    #
    # Changes to be committed:
    # (use "git rm --cached <file>..." to unstage)
    #
    # new file: README.md
    #
  ```

  * ### git commit——保存仓库的历史记录
  暂存区是提交之前的一个临时区域
  ```bash
    $ git commit -m "First commit"
    [master (root-commit) 9f129ba] First commit
    1 file changed, 0 insertions(+), 0 deletions(-)
    create mode 100644 README.md
  ```
  中止提交:如果在编辑器启动后想中止提交，请将提交信息留空并直接关闭编 辑器，随后提交就会被中止。

  * ### git log——查看提交日志
  ```bash
  # 只显示提交信息的第一行
  $ git log --pretty=short
  # 只显示指定目录、文件的日志:只要在 git log命令后加上目录名，便会只显示该目录下的日志。 如果加的是文件名，就会只显示与该文件相关的日志。
  $ git log README.md

  # 显示文件的改动
  $ git log -p
  ```

  * ### git diff——查看更改前后的差别
  git diff命令可以查看工作树、暂存区、最新提交之间的差别。
  ```bash
    $ git diff
    diff --git a/README.md b/README.md
    index e69de29..cb5dc9f 100644
    --- a/README.md
    +++ b/README.md
    @@ -0,0 +1 @@
    +# Git教程
  ```
  这里解释一下显示的内容。“ +”号标出的是新添加的行，被删除的 行则用“ -”号标出。我们可以看到，这次只添加了一行

  * ### 分支操作
  在进行多个并行作业时，我们会用到分支。master 分支是 Git 默认创建的分支，因此基本上所有开发都是以这个分 支为中心进行的。不同分支中，可以同时进行完全不同的作业。等该分支的作业完成 之后再与 master 分支合并。

    * #### git branch——显示分支一览表
    ```bash
      $ git branch
      * master
      # “ *”（星号），表示这是我们当前所 在的分支。
    ```

    * #### git checkout -b——创建、切换分支
    ```bash
      # 切换到 feature-A 分支并进行提交
      # 执行下面的命令，创建名为 feature-A 的分支。
      $ git checkout -b feature-A
      Switched to a new branch \'feature-A

      # 实际上，连续执行下面两条命令也能收到同样效果。
      $ git branch feature-A
      $ git checkout feature-A
    ```

    * #### 切换回上一个分支
    ```bash
      # 像上面这样用“ -”（连字符）代替分支名，就可以切换至上一个分 支。
      $ git checkout -
      Switched to branch \'feature-A
    ```

    * #### git merge——合并分支
    接下来，我们假设 feature-A 已经实现完毕，想要将它合并到主干分 支 master 中。首先切换到 master 分支。
    ```bash
      $ git checkout master
      # Switched to branch 'master'
    ```
    然后合并 feature-A 分支。为了在历史记录中明确记录下本次分支合 并，我们需要创建合并提交。因此，在合并时加上 --no-ff参数。
    ```bash
      $ git merge --no-ff feature-A
    ```

    * #### git log --graph——以图表形式查看分支
    用 git log --graph命令进行查看的话，能很清楚地看到特性 分支（feature-A）提交的内容已被合并。除此以外，特性分支的创建以 及合并也都清楚明了。

  * ### 更改提交的操作

    * #### git reset——回溯历史版本
    Git 的另一特征便是可以灵活操作历史版本。借助分散仓库的优势， 可以在不影响其他仓库的前提下对历史版本进行操作。
    要让仓库的 HEAD、暂存区、当前工作树回溯到指定状态，需要用 到 git rest --hard命令。只要提供目标时间点的哈希值
    ```bash
      $ git reset --hard fd0cbf0d4a25f747230694d95cac1be72d33441d
      HEAD is now at fd0cbf0 Add index
    ```

    * #### 推进至 feature-A 分支合并后的状态
    git log命令只能查看以当前状态为终点的历史日志。所以这里 要使用 git reflog命令，查看当前仓库的操作日志。在日志中找出 回溯历史之前的哈希值，通过 git reset --hard命令恢复到回溯历 史前的状态
    只要不进行 Git 的 GC（Garbage Collection，垃圾回收）， 就可以通过日志随意调取近期的历史状态，就像给时间机器指定一个时 间点，在过去未来中自由穿梭一般。

    * #### 消除冲突
    ```bash
      $ git merge --no-ff fix-B
      Auto-merging README.md
      CONFLICT (content): Merge conflict in README.md
      Recorded preimage for 'README.md'
      Automatic merge failed; fix conflicts and then commit the result.
    ```

    * #### git commit --amend——修改提交信息
    要修改上一条提交信息，可以使用 git commit --amend命令
    ```bash
      $ git commit --amend
    ```

    * #### git rebase -i——压缩历史
    在合并特性分支之前，如果发现已提交的内容中有些许拼写错误等， 不妨提交一个修改，然后将这个修改包含到前一个提交之中，压缩成一 个历史记录。
      * 创建 feature-C 分支
      ```bash
      $ git checkout -b feature-C
      ```

      * 作为 feature-C 的功能实现，我们在 README.md 文件中添加一行 文字，并且故意留下拼写错误，以便之后修正。

      提交这部分内容。这个小小的变更就没必要先执行 git add命令 再执行 git commit命令了，我们用 git commit -am命令来一次 完成这两步操作。

      * 更改历史
      我们要用到 git rebase命令。
      ```bash
      $ git rebase -i HEAD~2
      ```


  * ### 推送至远程仓库
  Git 是分散型版本管理系统我们将开始接触远在网络另一头的远程仓 库。远程仓库顾名思义，是与我们本地仓库相对独立的另一个仓库。 让我们先在 GitHub 上创建一个仓库，并将其设置为本地仓库的远程 仓库。

  创建时请不要 勾选 Initialize this repository with a README 选项（图 4.8）。因为一旦勾 选该选项， GitHub 一侧的仓库就会自动生成 README 文件，从创建之 初便与本地仓库失去了整合性。

    * #### git remote add——添加远程仓库
    ```bash
      $ git remote add origin git@github.com:github-book/git-tutorial.git
    ```

    * #### git push——推送至远程仓库
    ```bash
      $ git push -u origin master
    ```
    像这样执行 git push命令，当前分支的内容就会被推送给远程仓库 origin 的 master 分支。 -u参数可以在推送的同时，将 origin 仓库的 master 分 支设置为本地仓库当前分支的 upstream（上游）。添加了这个参数，将来 运行 git pull命令从远程仓库获取内容时，本地仓库的这个分支就可 以直接从 origin 的 master 分支获取内容，省去了另外添加参数的麻烦。

    * #### 推送至 master 以外的分支
    除了 master 分支之外，远程仓库也可以创建其他分支。举个例子，我 们在本地仓库中创建 feature-D 分支，并将它以同名形式 push 至远程仓库。
    ```bash
      $ git checkout -b feature-D
      $ git push -u origin feature-D
    ```
    * #### git clone——获取远程仓库
    ```bash
      $ git clone git@github.com:github-book/git-tutorial.git

      # 我们用 git branch -a命令查看当前分支的相关信息。添加 -a 参数可以同时显示本地仓库和远程仓库的分支信息。
      $ git branch -a
    ```

    * #### 获取远程的 feature-D 分支
    ```bash
      $ git checkout -b feature-D origin/feature-D
    ```
    -b 参数的后面是本地仓库中新建分支的名称。为了便于理解，我 们仍将其命名为 feature-D，让它与远程仓库的对应分支保持同名。新建 分支名称后面是获取来源的分支名称。例子中指定了 origin/feature-D， 就是说以名为 origin 的仓库（这里指 GitHub 端的仓库）的 feature-D 分 支为来源，在本地仓库中创建 feature-D 分支。

    * #### git pull——获取最新的远程仓库分支
    ```bash
      $ git pull origin feature-D
    ```

  * ### 帮助大家深入理解 Git 的资料
  要修改上一条提交信息，可以使用 git commit --amend命令
  ```bash
    $ git commit --amend
  ```
    * #### [Pro Git](http://git-scm.com/book/zh/v1)
    是一部零基础 的 Git 学习资料。
    * #### [LearnGitBranching](http://pcottle.github.io/learnGitBranching/)
    LearnGitBranchingA 是学习 Git 基本操作的网站
    * #### [tryGit](http://try.github.io/)
    通过 tryGitB 我们可以在 Web 上一边操作一边学习 Git 的基本功能

## 详细解说GitHub的功能

  * ### 键盘快捷键
  按下 shift ＋ / 显示快捷键一览表

  * ### 工具栏
    * LOGO
    点击 GitHub 的 LOGO 就会进入控制面板。控制面板的相关知识将 在后面讲解。
    * [Notifications](https://github.com/settings/notifications)
    这一图标用于提示用户是否有新的通知。当图标为蓝色时表示有未 读通知。
    * 搜索窗口
    在这里输入想找的用户或代码片段，就可以搜索到与之相关的 信息。
    * Explore
    从各个角度介绍 GitHub 上的热门软件。
    * Gist
    Gist 功能主要用于管理及发布一些没必要保存在仓库中的代码，比 如小的代码片段等。笔者就经常把一些随便编写的脚本代码等放在 Gist 中。系统会自动管理更新历史，并且提供了 Fork 功能。另外，通过 Gist 还可以很方便地为同事编写代码示例。
    * Pull Requests
    显示用户已进行过的 Pull Request。通过这里，开发者可以很方便地 追踪 Pull Request 的后续情况。
    * Wiki
    Wiki 是一种比 HTML 语法更简单的页面描述功能。常用于记录开 发者之间应该共享的信息或软件文档。数字表示当前 Wiki 的页面数量。
    * contributors
    显示对该仓库进行过提交的程序员名单

## 尝试 Pull…Request

  * ### 什么是 Pull Request
  Pull Request 是自己修改源代 码后，请求对方仓库采纳该修改时采取的一种行为。

  * ### Pull Request 的流程
  在 GitHub 上发送 Pull Request 后，接收方的仓库会创建一个附带源 代码的 Issue，我们在这个 Issue 中记录详细内容。这就是 Pull Request。

  只要 Pull Request 被顺利采纳，我们就会成为这个项目的 Contributor （贡献者），我们编写的这段代码也将被全世界的人使用。这正是社会化 编程和开源开发的一大乐趣

    * Fork
    点击 Fork 按钮创建自己的仓库
    * clone
    clone 仓库所需的访问信息显示在右侧的中央部分，让我们将它复 制下来，把这个仓库 clone 到当前的开发环境中。
    * branch
      * 为何要在特性分支中进行作业
      在 GitHub 上发 送 Pull Request 时，一般都是发送特性分支。这样一来， Pull Request 就 拥有了更明确的特性（主题）。让对方了解自己修改代码的意图，有助 于提高代码审查的效率。
      * 确认分支
      虽然通常情况下 最新版代码都位于 master 分支，但由于本次我们使用了 GitHub Pages， 所以最新代码位于 gh-pages 分支。
      * 创建特性分支
      我们创建一个名为 work 的分支，用来发送 Pull Request。这个 work 分支就是这次的特性分支。现在创建 work 分支并自动切换。
      ```bash
      $ git checkout -b work gh-pages
      ```
      * 添加代码，提交修改
      用 git diff命令查看修改是否已经正确进行。
      ```bash
      $ git diff
      ```
      * 创建远程分支
      要从 GitHub 发送 Pull Request， GitHub 端的仓库中必须有一个包 含了修改后代码的分支。我们现在就来创建本地 work 分支的相应远程 分支。
      ```bash
      $ git push origin work
      ```

  * ### 仓库的维护
  Fork 或 clone 来的仓库，一旦放置不管就会离最新的源代码越来越 远。如果不以最新的源代码为基础进行开发，劳神费力地编写代码也很 可能是白费力气。下面就让我们学习如何让仓库保持最新状态。
    * 获取最新数据
    下面我们从远程仓库实际获取（fetch）最新源代码，与自己仓库的 分支进行合并。要让仓库维持最新状态，只需要重复这一工作即可。
    ```bash
    $ git fetch upstream
    From git://github.com/octocat/Spoon-Knife
    ```

## 与GitHub相互协作的工具及服务
GitHub 的诞生并不单单影响到了软件开发的相关人员。现在的 GitHub 已经真正成为了一个 [Hub](https://hub.github.com/)

  * ### 安装
  hub 命令需要以下版本的软件
    * Git 1.7.3 以上
    * Ruby 1.8.6 以上
  如果是 OS X 系统，可以从版本管理系统的 Homebrew 或 MacPorts 轻松安装。
  ```bash
    # 如果用 Homebrew，则执行下面的命令
    $ brew install hub

    #如果用 MacPorts，则执行下面的命令。
    $ sudo port install hub

    # 使用其他环境的读者请按照下面的流程安装。
    $ curl https://hub.github.com/standalone -sLo ~/bin/hub
    $ chmod +x ~/bin/hub

    # 通过上述命令下载 hub 命令之后，像下面这样在 shell 的环境路径 后面添加 ~/bin。
    $ echo 'export PATH="~/bin:$PATH"' >> ~/.bash_profile

    # 确认运行情况
    $ hub --version

    # 设置别名
    # 具体设置方法其实很简单，只需在 shell 的配置文件（.bash_profile
    # 等）中添加下面一句即可。
    # eval "$(hub alias -s)"

  ```

## 团队使用 GitHub 时的注意事项
  ❶ 令 master 分支时常保持可以部署的状态
  ❷ 进行新的作业时要从 master 分支创建新分支，新分支名称要具有
  描述性
  ❸ 在❷新建的本地仓库分支中进行提交
  ❹ 在 GitHub 端仓库创建同名分支，定期 push
  ❺ 需要帮助或反馈时创建 Pull Request，以 Pull Request 进行交流
  ❻ 让其他开发者进行审查，确认作业完成后与 master 分支合并
  ❼ 与 master 分支合并后立刻部署

  这个流程必须遵守“令 master 分支随时保持可以部署的状态”这一规 则。每隔几小时进行一次部署，可以有效防止同时出现多个严重 BUG。
